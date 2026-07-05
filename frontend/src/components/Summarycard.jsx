const SummaryCard = ({ title, amount, color }) => {
  return (
    <div className="rounded-2xl bg-white shadow p-6">
      <h3 className="text-slate-500">{title}</h3>

      <h1 className={`mt-4 text-3xl font-bold ${color}`}>
        {amount}
      </h1>
    </div>
  );
};

export default SummaryCard;