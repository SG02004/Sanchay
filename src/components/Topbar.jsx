const Topbar = () => {
  return (
    <header className="flex items-center justify-between bg-white rounded-xl shadow p-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Welcome Back 👋
        </h2>

        <p className="text-slate-500">
          Here's your financial overview.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
          SG
        </div>
      </div>
    </header>
  );
};

export default Topbar;