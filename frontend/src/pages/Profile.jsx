import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Shield,
  CalendarDays,
  LogOut,
  Pencil,
  KeyRound,
} from "lucide-react";

import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import API from "../services/api";
import { formatDate, getInitials } from "../lib/finance";

const Profile = () => {
  const navigate = useNavigate();
  const { logout, user, updateUser } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Name edit state
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);

  // Password change state
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/profile");
        setProfile(data);
        setName(data.name || "");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setSavingName(true);
    try {
      const { data } = await API.put("/profile", { name: name.trim() });
      setProfile(data);
      updateUser({ name: data.name }); // keep sidebar/topbar in sync
      setEditingName(false);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setSavingPassword(true);
    try {
      await API.put("/profile", { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setShowPassword(false);
      toast.success("Password changed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  const currentProfile = profile || user;

  return (
    <Layout>
      <div className="max-w-2xl rounded-3xl bg-white p-8 shadow">
        <div className="flex items-center gap-6 border-b pb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-2xl font-bold text-white">
            {getInitials(currentProfile?.name)}
          </div>

          <div className="flex-1">
            {editingName ? (
              <form onSubmit={handleSaveName} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-lg focus:border-emerald-500 focus:outline-none"
                  placeholder="Your name"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={savingName}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {savingName ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingName(false);
                      setName(currentProfile?.name || "");
                    }}
                    className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-slate-800">
                    {loading ? "Loading..." : currentProfile?.name || "User"}
                  </h1>
                  {!loading && (
                    <button
                      onClick={() => setEditingName(true)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-emerald-600"
                      title="Edit name"
                    >
                      <Pencil size={18} />
                    </button>
                  )}
                </div>
                <p className="text-slate-500">Manage your account details.</p>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-5">
          <div className="flex items-center gap-3">
            <Mail className="text-emerald-600" size={20} />
            <span>{currentProfile?.email || "Not available"}</span>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="text-emerald-600" size={20} />
            <span className="capitalize">{currentProfile?.role || "user"}</span>
          </div>

          <div className="flex items-center gap-3">
            <CalendarDays className="text-emerald-600" size={20} />
            <span>
              Joined {currentProfile?.createdAt ? formatDate(currentProfile.createdAt) : "Not available"}
            </span>
          </div>
        </div>

        {/* Change password */}
        <div className="mt-8 border-t pt-6">
          {showPassword ? (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                <KeyRound size={18} className="text-emerald-600" /> Change password
              </h2>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
                placeholder="Current password"
                required
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-emerald-500 focus:outline-none"
                placeholder="New password (min 6 characters)"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  {savingPassword ? "Saving..." : "Update password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                  }}
                  className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowPassword(true)}
              className="flex items-center gap-3 rounded-xl bg-slate-50 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <KeyRound size={20} className="text-emerald-600" />
              Change password
            </button>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-3 rounded-xl bg-red-50 px-5 py-3 font-medium text-red-500 transition hover:bg-red-100"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </Layout>
  );
};

export default Profile;
