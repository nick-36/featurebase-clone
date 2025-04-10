import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

type SubmissionsData = {
  name: string | null;
  submissions: number;
  fullName: string | null;
}[];

const BarChartComp = ({
  submissionsData,
}: {
  submissionsData: SubmissionsData;
}) => {
  const colors = {
    border: "hsl(220, 13%, 91%)",
    cardForeground: "hsl(222, 47%, 11%)",
    popover: "hsl(0, 0%, 100%)",
    popoverForeground: "hsl(222, 47%, 11%)",
    chart1: "oklch(0.606 0.25 292.717)",
    mutedForeground: "hsl(215, 16%, 47%)",
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={submissionsData}
        margin={{ top: 5, right: 20, left: 20, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={60}
          tick={{
            fill: colors.cardForeground,
            fontSize: 12,
          }}
          tickLine={{ stroke: colors.border }}
          axisLine={{ stroke: colors.border }}
        />
        <YAxis
          allowDecimals={false}
          tick={{
            fill: colors.cardForeground,
            fontSize: 12,
          }}
          tickLine={{ stroke: colors.border }}
          axisLine={{ stroke: colors.border }}
        />
        <Tooltip
          formatter={(value) => [value, "Submissions"]}
          labelFormatter={(label) => {
            const survey = submissionsData.find((s) => s.name === label);
            return survey?.fullName || label;
          }}
          contentStyle={{
            backgroundColor: colors.popover,
            color: colors.popoverForeground,
            border: `1px solid ${colors.border}`,
            borderRadius: "0.5rem", // Using direct value instead of CSS variable
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            padding: "0.75rem",
          }}
        />
        <Legend
          wrapperStyle={{ paddingTop: 10 }}
          formatter={(value) => (
            <span
              style={{
                color: colors.mutedForeground,
                fontSize: 12,
              }}
            >
              {value}
            </span>
          )}
        />
        <Bar
          dataKey="submissions"
          name="Submissions"
          fill={colors.chart1}
          radius={[4, 4, 0, 0]}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComp;
