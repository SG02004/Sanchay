import { useState } from "react";
import Layout from "../components/Layout";

const Transactions = () => {

  // Existing Transactions
  const [transactions, setTransactions] = useState([
    {
      date: "20 Jun",
      category: "🍔 Food",
      amount: "₹450",
      type: "Expense",
    },
    {
      date: "18 Jun",
      category: "💼 Salary",
      amount: "₹35,000",
      type: "Income",
    },
    {
      date: "15 Jun",
      category: "🛍 Shopping",
      amount: "₹2,000",
      type: "Expense",
    },
  ]);

  // Controls opening/closing of modal
  const [showModal, setShowModal] = useState(false);

  // Stores new transaction form values
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    category: "",
    amount: "",
    type: "Expense",
  });

  // Called when Save button is clicked
  const handleSave = () => {

    // Simple validation
    if (
      !newTransaction.date ||
      !newTransaction.category ||
      !newTransaction.amount
    ) {
      alert("Please fill all fields");
      return;
    }

    // Add new transaction to table
    setTransactions([
      ...transactions,
      newTransaction,
    ]);

    // Clear form
    setNewTransaction({
      date: "",
      category: "",
      amount: "",
      type: "Expense",
    });

    // Close popup
    setShowModal(false);
  };
  return (
  <Layout>

    {/* Header */}

    <div className="flex items-center justify-between">

      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          Transactions
        </h1>

        <p className="mt-2 text-slate-500">
          View and manage all your transactions.
        </p>

      </div>

      <button
        onClick={() => setShowModal(true)}
        className="rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700"
      >
        + Add Transaction
      </button>

    </div>

    {/* Transactions Table */}

    <div className="mt-8 rounded-2xl bg-white p-6 shadow">

      <table className="w-full">

        <thead>

          <tr className="border-b text-left">

            <th className="py-3">Date</th>

            <th>Category</th>

            <th>Amount</th>

            <th>Type</th>

          </tr>

        </thead>

        <tbody>

          {transactions.map((item, index) => (

            <tr
              key={index}
              className="border-b hover:bg-slate-50"
            >

              <td className="py-4">
                {item.date}
              </td>

              <td>
                {item.category}
              </td>

              <td>
                {item.amount}
              </td>

              <td>

                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    item.type === "Income"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-500"
                  }`}
                >

                  {item.type}

                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

    {/* Modal */}

    {showModal && (

      <div className="fixed inset-0 flex items-center justify-center bg-black/40">

        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

          <h2 className="mb-6 text-2xl font-bold">
            Add Transaction
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Date"
              value={newTransaction.date}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  date: e.target.value,
                })
              }
              className="w-full rounded-xl border p-3"
            />

            <input
              type="text"
              placeholder="Category"
              value={newTransaction.category}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  category: e.target.value,
                })
              }
              className="w-full rounded-xl border p-3"
            />

            <input
              type="text"
              placeholder="Amount"
              value={newTransaction.amount}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  amount: e.target.value,
                })
              }
              className="w-full rounded-xl border p-3"
            />

            <select
              value={newTransaction.type}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  type: e.target.value,
                })
              }
              className="w-full rounded-xl border p-3"
            >

              <option>Expense</option>

              <option>Income</option>

            </select>

          </div>

          <div className="mt-6 flex justify-end gap-3">

            <button
              onClick={() => setShowModal(false)}
              className="rounded-xl bg-slate-200 px-5 py-2"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="rounded-xl bg-emerald-600 px-5 py-2 text-white"
            >
              Save
            </button>

          </div>

        </div>

      </div>

    )}

  </Layout>
);
}

export default Transactions;