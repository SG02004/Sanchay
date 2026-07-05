import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import Layout from "../components/Layout";
import { Trash2, Users } from "lucide-react";

const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get("/admin/users");
        setUsers(data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await API.delete(`/admin/users/${id}`);
      setUsers((current) => current.filter((u) => u._id !== id));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            <Users size={20} className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
            <p className="text-sm text-slate-500">Manage all registered users</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

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
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{u.name}</td>
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
                          onClick={() => handleDelete(u._id, u.name)}
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
          Total users: {users.length}
        </p>
      </div>
    </Layout>
  );
};

export default AdminPanel;
