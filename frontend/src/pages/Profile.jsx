import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Shield,
  CalendarDays,
  LogOut,
} from "lucide-react";

import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { formatDate, getInitials } from "../lib/finance";

const Profile = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/profile");
        setProfile(data);
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

  const currentProfile = profile || user;

  return (
    <Layout>
      <div className="max-w-2xl rounded-3xl bg-white p-8 shadow">
        <div className="flex items-center gap-6 border-b pb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-2xl font-bold text-white">
            {getInitials(currentProfile?.name)}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              {loading ? "Loading..." : currentProfile?.name || "User"}
            </h1>

            <p className="text-slate-500">
              Read-only account details from the database.
            </p>
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

        <button
          onClick={handleLogout}
          className="mt-10 flex items-center gap-3 rounded-xl bg-red-50 px-5 py-3 font-medium text-red-500 transition hover:bg-red-100"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </Layout>
  );
};

export default Profile;
