import { PiggyBank } from "lucide-react";

const BrandLogo = () => {
  return (
    <div className="flex flex-col items-center">

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-xl">

        <PiggyBank
          className="h-10 w-10 text-white"
          strokeWidth={2.5}
        />

      </div>

      <h1 className="text-5xl font-black tracking-tight text-slate-900">
        Sanchay
      </h1>

      <p className="mt-2 text-center text-slate-500">
        Track Smart. Save Better.
      </p>

    </div>
  );
};

export default BrandLogo;