import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import Layout from "../components/Layout";
import API from "../services/api";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  formatCurrency,
  formatDate,
} from "../lib/finance";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [newTransaction, setNewTransaction] = useState({
    category: "",
    amount: "",
    description: "",
    date: "",
    type: "Expense",
  });

  const activeCategories =
    newTransaction.type === "Income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await API.get("/transactions");
        setTransactions(data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleSave = async () => {
    if (!newTransaction.category || !newTransaction.amount || !newTransaction.date) {
      setError("Please fill category, amount, and date.");
      return;
    }

    setSaving(true);
    try {
      const { data } = await API.post("/transactions", {
        ...newTransaction,
        amount: Number(newTransaction.amount),
      });

      setTransactions((current) => [data, ...current]);
      setNewTransaction({
        category: "",
        amount: "",
        description: "",
        date: "",
        type: "Expense",
      });
      setShowModal(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create transaction.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await API.delete(`/transactions/${id}`);
      setTransactions((current) => current.filter((item) => item._id !== id));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete transaction.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

      {error && (
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl bg-white p-6 shadow">
        <table className="min-w-full">
          <thead>
            <tr className="border-b text-left text-sm text-slate-500">
              <th className="py-3 pr-4">Date</th>
              <th className="pr-4">Category</th>
              <th className="pr-4">Description</th>
              <th className="pr-4">Amount</th>
              <th className="pr-4">Type</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400">
                  Loading transactions...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400">
                  No transactions yet.
                </td>
              </tr>
            ) : (
              transactions.map((item) => (
                <tr
                  key={item._id}
                  className="border-b last:border-0 hover:bg-slate-50"
                >
                  <td className="py-4 pr-4">{formatDate(item.date)}</td>
                  <td className="pr-4 font-medium text-slate-800">{item.category}</td>
                  <td className="pr-4 text-slate-500">
                    {item.description || "No description"}
                  </td>
                  <td className="pr-4 font-semibold text-slate-900">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="pr-4">
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
                  <td className="text-right">
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold">
              Add Transaction
            </h2>

            <div className="space-y-4">
              <select
                value={newTransaction.type}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    type: e.target.value,
                    category: "",
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-3"
              >
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </select>

              <select
                value={newTransaction.category}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    category: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-3"
              >
                <option value="">Select category</option>
                {activeCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="0"
                placeholder="Amount"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    amount: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-3"
              />

              <input
                type="date"
                value={newTransaction.date}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    date: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-3"
              />

              <input
                type="text"
                placeholder="Description (optional)"
                value={newTransaction.description}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    description: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-3"
              />
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
                disabled={saving}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Transactions;
