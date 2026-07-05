import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "./BrandLogo";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  BarChart3,
  User,
  LogOut,
  Shield,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Transactions",
    icon: Receipt,
    path: "/transactions",
  },
  {
    name: "Budget",
    icon: Wallet,
    path: "/budget",
  },
  {
    name: "Insights",
    icon: BarChart3,
    path: "/insights",
  },
  {
    name: "Profile",
    icon: User,
    path: "/profile",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r bg-white p-6 shadow-lg">
      <div className="mb-10">
        <BrandLogo />
      </div>

      <nav className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {user?.role === "admin" && (
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `mt-3 flex items-center gap-3 rounded-xl px-4 py-3 transition ${
              isActive
                ? "bg-emerald-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`
          }
        >
          <Shield size={20} />
          Admin Panel
        </NavLink>
      )}

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl bg-red-50 px-4 py-3 font-medium text-red-500 transition hover:bg-red-100"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
