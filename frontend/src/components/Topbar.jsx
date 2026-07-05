import { useAuth } from "../context/AuthContext";
import { getInitials } from "../lib/finance";

const Topbar = () => {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between rounded-xl bg-white p-5 shadow">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Welcome Back, {user?.name?.split(" ")[0] || "User"}
        </h2>

        <p className="text-slate-500">
          Here's your financial overview.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="font-semibold text-slate-800">{user?.name}</p>
          <p className="text-sm capitalize text-slate-500">{user?.role || "user"}</p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
          {getInitials(user?.name)}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
