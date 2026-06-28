import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Food", value: 40 },
  { name: "Shopping", value: 25 },
  { name: "Travel", value: 20 },
  { name: "Bills", value: 15 },
];

const COLORS = [
  "#10B981",
  "#3B82F6",
  "#F97316",
  "#8B5CF6",
];

const PieChartCard = () => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <h2 className="mb-6 text-xl font-bold text-slate-800">
        Expense Breakdown
      </h2>

      <div className="h-72">

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
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [`${value}%`, "Expense"]}
            />

            {/* Center Text */}

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
              ₹28.5K
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
                  backgroundColor: COLORS[index],
                }}
              ></span>

              <span className="font-medium text-slate-700">
                {item.name}
              </span>

            </div>

            <span className="font-semibold text-slate-900">
              {item.value}%
            </span>

          </div>

        ))}

      </div>

    </div>
  );
};

export default PieChartCard;