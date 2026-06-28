import Layout from "../components/Layout";

const Budget = () => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold">
        Budget
      </h1>

      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-semibold mb-4">
            Food Budget
          </h2>

          <progress
            value="70"
            max="100"
            className="w-full"
          />

          <p className="mt-4 text-slate-500">
            ₹7,000 / ₹10,000 Used
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-semibold mb-4">
            Shopping Budget
          </h2>

          <progress
            value="40"
            max="100"
            className="w-full"
          />

          <p className="mt-4 text-slate-500">
            ₹4,000 / ₹10,000 Used
          </p>
        </div>

      </div>
    </Layout>
  );
};

export default Budget;