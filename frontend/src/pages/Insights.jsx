import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Layout from "../components/Layout";
import PieChartCard from "../components/PieChartCard";
import API from "../services/api";
import { formatCurrency } from "../lib/finance";

const Insights = () => {
  const [insights, setInsights] = useState({
    monthlyChartData: [],
    pieChartData: [],
    totalExpense: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const { data } = await API.get("/dashboard");
        setInsights({
          monthlyChartData: data.monthlyChartData || [],
          pieChartData: data.pieChartData || [],
          totalExpense: data.totalExpense || 0,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold">
        Insights
      </h1>

      {/* <p className="mt-2 text-slate-500">
        Reused dashboard analytics for your demo charts.
      </p> */}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow xl:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-800">Income vs Expense</h2>
            <p className="text-sm text-slate-500">Last 6 months</p>
          </div>

          <div className="h-80">
            {loading ? (
              <div className="flex h-full items-center justify-center text-slate-400">
                Loading chart...
              </div>
            ) : insights.monthlyChartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-slate-400">
                Add transactions to see monthly trends.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(value), "Amount"]} />
                  <Bar dataKey="income" fill="#16a34a" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <PieChartCard
          data={insights.pieChartData}
          totalExpense={insights.totalExpense}
        />
      </div>
    </Layout>
  );
};

export default Insights;
