import { useEffect, useState } from "react";
import { Trash2, Pencil, Check, X } from "lucide-react";
import Layout from "../components/Layout";
import API from "../services/api";
import { useToast } from "../context/ToastContext";
import {
  EXPENSE_CATEGORIES,
  formatCurrency,
} from "../lib/finance";

const Budget = () => {
  const toast = useToast();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [editingId, setEditingId] = useState("");   // which budget is being edited
  const [editLimit, setEditLimit] = useState("");   // the new limit being typed
  const [form, setForm] = useState({
    category: "",
    limit: "",
  });

  useEffect(() => {
    let ignore = false;

    const loadBudgets = async () => {
      try {
        const { data } = await API.get("/budget");
        if (!ignore) {
          setBudgets(data);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.message || "Failed to load budgets.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadBudgets();

    return () => {
      ignore = true;
    };
  }, []);

  const refreshBudgets = async () => {
    const { data } = await API.get("/budget");
    setBudgets(data);
  };

  const handleCreateBudget = async () => {
    if (!form.category || !form.limit) {
      setError("Please select a category and budget limit.");
      toast.error("Please select a category and budget limit.");
      return;
    }

    setSaving(true);
    try {
      await API.post("/budget", {
        category: form.category,
        limit: Number(form.limit),
      });
      setForm({ category: "", limit: "" });
      await refreshBudgets();
      setError("");
      toast.success("Budget added");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create budget.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // Start editing a budget's limit
  const startEdit = (budget) => {
    setEditingId(budget._id);
    setEditLimit(String(budget.limit));
  };

  const cancelEdit = () => {
    setEditingId("");
    setEditLimit("");
  };

  // Save the edited limit (PUT /api/budget/:id)
  const handleUpdateLimit = async (id) => {
    if (!editLimit) {
      toast.error("Please enter a limit.");
      return;
    }
    try {
      await API.put(`/budget/${id}`, { limit: Number(editLimit) });
      await refreshBudgets();
      cancelEdit();
      toast.success("Budget updated");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update budget.";
      setError(msg);
      toast.error(msg);
    }
  };

  // Delete a budget (DELETE /api/budget/:id)
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await API.delete(`/budget/${id}`);
      setBudgets((current) => current.filter((b) => b._id !== id));
      toast.success("Budget deleted");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete budget.";
      setError(msg);
      toast.error(msg);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Budget
          </h1>

          <p className="mt-2 text-slate-500">
            Track category-wise limits against your real spending.
          </p>
        </div>

        <div className="grid gap-3 rounded-2xl bg-white p-4 shadow sm:grid-cols-3">
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="rounded-xl border border-slate-200 px-3 py-2"
          >
            <option value="">Select category</option>
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="0"
            value={form.limit}
            onChange={(e) => setForm({ ...form, limit: e.target.value })}
            placeholder="Budget limit"
            className="rounded-xl border border-slate-200 px-3 py-2"
          />

          <button
            onClick={handleCreateBudget}
            disabled={saving}
            className="rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Add Budget"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {loading ? (
          <div className="rounded-2xl bg-white p-6 text-slate-400 shadow">
            Loading budgets...
          </div>
        ) : budgets.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-slate-400 shadow">
            No budgets yet. Add your first category budget above.
          </div>
        ) : (
          budgets.map((budget) => {
            const percentage = Number.isFinite(budget.percentage) ? budget.percentage : 0;
            const progress = Math.min(percentage, 100);
            const progressColor =
              percentage >= 100
                ? "bg-red-500"
                : percentage >= 80
                  ? "bg-amber-500"
                  : "bg-emerald-500";
            const isEditing = editingId === budget._id;

            return (
              <div key={budget._id} className="rounded-2xl bg-white p-6 shadow">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-800">
                    {budget.category}
                  </h2>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500">
                      {percentage}%
                    </span>

                    {!isEditing && (
                      <>
                        <button
                          onClick={() => startEdit(budget)}
                          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100"
                          title="Edit limit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(budget._id)}
                          disabled={deletingId === budget._id}
                          className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50 disabled:opacity-60"
                          title="Delete budget"
                        >
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${progressColor}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {isEditing ? (
                  <div className="mt-4 flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={editLimit}
                      onChange={(e) => setEditLimit(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      placeholder="New limit"
                    />
                    <button
                      onClick={() => handleUpdateLimit(budget._id)}
                      className="rounded-lg bg-emerald-600 p-2 text-white transition hover:bg-emerald-700"
                      title="Save"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="rounded-lg bg-slate-200 p-2 text-slate-600 transition hover:bg-slate-300"
                      title="Cancel"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <p className="text-slate-500">
                      {formatCurrency(budget.spent)} spent
                    </p>
                    <p className="font-semibold text-slate-800">
                      {formatCurrency(budget.limit)} limit
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
};

export default Budget;
