import { useNavigate } from "react-router-dom";
import {
  Mail,
  GraduationCap,
  LogOut,
} from "lucide-react";

import Layout from "../components/Layout";

const Profile = () => {
  const navigate = useNavigate();

  const userEmail =
    localStorage.getItem("userEmail") || "Not Available";

  const handleLogout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("userEmail");

    navigate("/");
  };

  return (
    <Layout>

      <div className="max-w-2xl rounded-3xl bg-white p-8 shadow">


        <div className="flex items-center gap-6 border-b pb-6">

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-2xl font-bold text-white">
            SG
          </div>

          <div>

            <h1 className="text-3xl font-bold text-slate-800">
              Saurabh Goswami
            </h1>

            <p className="text-slate-500">
              Welcome to Sanchay 👋
            </p>

          </div>

        </div>


        <div className="mt-8 space-y-5">

          <div className="flex items-center gap-3">

            <Mail className="text-emerald-600" size={20} />

            <span>{userEmail}</span>

          </div>

          <div className="flex items-center gap-3">

            <GraduationCap
              className="text-emerald-600"
              size={20}
            />

            <span>MCA Student - BCIIT</span>

          </div>

        </div>

        {/* Logout */}

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