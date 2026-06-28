import Layout from "../components/Layout";
import SummaryCard from "../components/SummaryCard";
import PieChartCard from "../components/PieChartCard";
const Dashboard = () => {
  return (
    <Layout>

      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          Monitor your financial activity at a glance.
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

        <SummaryCard
          title="Income"
          amount="₹45,000"
          color="text-green-600"
        />

        <SummaryCard
          title="Expense"
          amount="₹28,500"
          color="text-red-500"
        />

        <SummaryCard
          title="Balance"
          amount="₹16,500"
          color="text-blue-600"
        />

        <SummaryCard
          title="Savings"
          amount="₹10,000"
          color="text-emerald-600"
        />

      </div>

     
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

  {/* Recent Transactions */}

  <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-md">

    <h2 className="text-xl font-bold mb-5">
      Recent Transactions
    </h2>

    <div className="space-y-5">

      <div className="flex justify-between">
        <span>Salary</span>
        <span className="text-green-600">+ ₹35,000</span>
      </div>

      <div className="flex justify-between">
        <span>Swiggy</span>
        <span className="text-red-500">- ₹450</span>
      </div>

      <div className="flex justify-between">
        <span>Netflix</span>
        <span className="text-red-500">- ₹649</span>
      </div>

      <div className="flex justify-between">
        <span>Uber</span>
        <span className="text-red-500">- ₹230</span>
      </div>

    </div>

  </div>

  {/* Pie Chart */}

  <PieChartCard />

</div>
        

    </Layout>
  );
};

export default Dashboard;