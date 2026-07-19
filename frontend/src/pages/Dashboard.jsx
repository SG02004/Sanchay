import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import Layout from "../components/Layout";
import SummaryCard from "../components/SummaryCard";
import PieChartCard from "../components/PieChartCard";
import API from "../services/api";
import {
  formatCompactCurrency,
  formatCurrency,
  formatDate,
} from "../lib/finance";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    pieChartData: [],
    recentTransactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Budgets that have crossed the 80% warning threshold (for the alert banner)
  const [budgetAlerts, setBudgetAlerts] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await API.get("/dashboard");
        setDashboard({
          totalIncome: data.totalIncome || 0,
          totalExpense: data.totalExpense || 0,
          balance: data.balance || 0,
          pieChartData: data.pieChartData || [],
          recentTransactions: data.recentTransactions || [],
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    // Reuse the /api/budget percentages to surface over-budget warnings.
    // Any category at or above 80% of its limit becomes an alert.
    const fetchBudgetAlerts = async () => {
      try {
        const { data } = await API.get("/budget");
        const alerts = (data || [])
          .filter((b) => b.percentage >= 80)
          .sort((a, b) => b.percentage - a.percentage);
        setBudgetAlerts(alerts);
      } catch {
        // Non-critical: if budgets fail to load we simply show no alerts.
        setBudgetAlerts([]);
      }
    };

    fetchDashboard();
    fetchBudgetAlerts();
  }, []);

  const savingsRate =
    dashboard.totalIncome > 0
      ? Math.max(0, (dashboard.balance / dashboard.totalIncome) * 100)
      : 0;

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="mt-1 text-slate-500">
          Monitor your financial activity at a glance.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: "0ms" }}>
          <SummaryCard
            title="Income"
            amount={loading ? "Loading..." : formatCompactCurrency(dashboard.totalIncome)}
            color="text-green-600"
          />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: "75ms" }}>
          <SummaryCard
            title="Expense"
            amount={loading ? "Loading..." : formatCompactCurrency(dashboard.totalExpense)}
            color="text-red-500"
          />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: "150ms" }}>
          <SummaryCard
            title="Balance"
            amount={loading ? "Loading..." : formatCompactCurrency(dashboard.balance)}
            color="text-blue-600"
          />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: "225ms" }}>
          <SummaryCard
            title="Savings Rate"
            amount={loading ? "Loading..." : `${Math.round(savingsRate)}%`}
            color="text-emerald-600"
          />
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {budgetAlerts.length > 0 && (
        <div className="mt-8 space-y-3">
          {budgetAlerts.map((b, index) => {
            const over = b.percentage >= 100;
            return (
              <div
                key={b._id}
                className={`animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex items-start gap-3 rounded-2xl border px-5 py-4 ${
                  over
                    ? "border-red-200 bg-red-50"
                    : "border-amber-200 bg-amber-50"
                }`}
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <AlertTriangle
                  className={over ? "text-red-500" : "text-amber-500"}
                  size={20}
                />
                <p className={`text-sm font-medium ${over ? "text-red-700" : "text-amber-700"}`}>
                  {over
                    ? `You've exceeded your ${b.category} budget — spent ${formatCurrency(
                        b.spent
                      )} of ${formatCurrency(b.limit)} (${b.percentage}%).`
                    : `You've used ${b.percentage}% of your ${b.category} budget — ${formatCurrency(
                        b.spent
                      )} of ${formatCurrency(b.limit)}.`}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-md lg:col-span-2">
          <h2 className="mb-5 text-xl font-bold">
            Recent Transactions
          </h2>

          {loading ? (
            <p className="text-slate-400">Loading recent transactions...</p>
          ) : dashboard.recentTransactions.length === 0 ? (
            <p className="text-slate-400">
              No transactions yet. Add your first one from the Transactions page.
            </p>
          ) : (
            <div className="space-y-4">
              {dashboard.recentTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{transaction.category}</p>
                    <p className="text-sm text-slate-500">
                      {transaction.description || "No description"} • {formatDate(transaction.date)}
                    </p>
                  </div>

                  <span
                    className={`font-semibold ${
                      transaction.type === "Income" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {transaction.type === "Income" ? "+" : "-"} {formatCurrency(transaction.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <PieChartCard
          data={dashboard.pieChartData}
          totalExpense={dashboard.totalExpense}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
