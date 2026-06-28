import Layout from "../components/Layout";

const Insights = () => {
  return (
    <Layout>

      <h1 className="text-3xl font-bold">
        Insights
      </h1>

      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-2xl shadow h-72 flex items-center justify-center">
          📊 Monthly Expense Chart
        </div>

        <div className="bg-white rounded-2xl shadow h-72 flex items-center justify-center">
          📈 Income vs Expense
        </div>

      </div>

    </Layout>
  );
};

export default Insights;