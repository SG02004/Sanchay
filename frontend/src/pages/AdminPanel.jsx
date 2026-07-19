import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import Layout from "../components/Layout";
import { formatCurrency } from "../lib/finance";
import {
  Trash2,
  Users,
  Search,
  Activity,
  TrendingUp,
  IndianRupee,
  UserX,
} from "lucide-react";

const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalIncome: 0,
    totalExpense: 0,
    totalVolume: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, statsRes] = await Promise.all([
          API.get("/admin/users"),
          API.get("/admin/stats"),
        ]);
        setUsers(usersRes.data);
        setStats(statsRes.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await API.delete(`/admin/users/${deleteTarget.id}`);
      setUsers((current) => current.filter((u) => u._id !== deleteTarget.id));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "emerald",
      isCurrency: false,
    },
    {
      title: "Total Transactions",
      value: stats.totalTransactions,
      icon: Activity,
      color: "blue",
      isCurrency: false,
    },
    {
      title: "Total Income",
      value: stats.totalIncome,
      icon: TrendingUp,
      color: "green",
      isCurrency: true,
    },
    {
      title: "Total Expenses",
      value: stats.totalExpense,
      icon: IndianRupee,
      color: "red",
      isCurrency: true,
    },
  ];

  const colorMap = {
    emerald: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
    },
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
    },
    red: {
      bg: "bg-red-100",
      text: "text-red-600",
    },
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            <Users size={20} className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
            <p className="text-sm text-slate-500">
              Manage all registered users
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            const colors = colorMap[card.color];
            return (
              <div
                key={card.title}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both rounded-2xl bg-white p-6 shadow"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg}`}
                  >
                    <Icon size={22} className={colors.text} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{card.title}</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {card.isCurrency
                        ? formatCurrency(card.value)
                        : card.value.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search users by name or email…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-sm font-medium text-slate-500">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {u.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {u._id !== user._id ? (
                        <button
                          onClick={() =>
                            setDeleteTarget({ id: u._id, name: u.name })
                          }
                          className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">You</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <UserX size={26} className="text-red-600" />
              </div>
            </div>
            <h2 className="mb-2 text-center text-xl font-bold text-slate-900">
              Delete User
            </h2>
            <p className="mb-6 text-center text-sm text-slate-500">
              Are you sure you want to delete &ldquo;{deleteTarget.name}&rdquo;?
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl bg-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-xl bg-red-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-600"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminPanel;
