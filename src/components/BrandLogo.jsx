import { PiggyBank } from "lucide-react";

const BrandLogo = () => {
  return (
    <div className="flex flex-col items-center">

      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-xl sm:mb-6 sm:h-20 sm:w-20">

        <PiggyBank
          className="h-8 w-8 text-white sm:h-10 sm:w-10"
          strokeWidth={2.5}
        />

      </div>

      <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
        Sanchay
      </h1>

      <p className="mt-2 text-center text-slate-500">
        Track Smart. Save Better.
      </p>

    </div>
  );
};

export default BrandLogo;
