import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  formatCompactCurrency,
  formatCurrency,
} from "../lib/finance";

const COLORS = [
  "#10B981",
  "#3B82F6",
  "#F97316",
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
  "#6366F1",
  "#14B8A6",
];

const PieChartCard = ({ data = [], totalExpense = 0 }) => {
  return (
    <div className="h-full rounded-3xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <h2 className="mb-6 text-xl font-bold text-slate-800">
        Expense Breakdown
      </h2>

      <div className="h-72">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-400">
            No expense data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={60}
                paddingAngle={4}
                dataKey="value"
                label={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`${entry.name}-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [formatCurrency(value), "Amount"]}
              />

              <text
                x="50%"
                y="47%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  fill: "#0f172a",
                }}
              >
                {formatCompactCurrency(totalExpense)}
              </text>

              <text
                x="50%"
                y="58%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: "13px",
                  fill: "#64748b",
                }}
              >
                Spent
              </text>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-lg px-2 py-1 hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: COLORS[index % COLORS.length],
                }}
              />

              <span className="font-medium text-slate-700">
                {item.name}
              </span>
            </div>

            <span className="font-semibold text-slate-900">
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartCard;
