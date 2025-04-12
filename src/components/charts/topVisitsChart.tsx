import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from "recharts";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

interface VisitData {
  name: string;
  visits: number;
}

export function TopVisitsChart({
  visitsData = [],
}: {
  visitsData: VisitData[];
}) {
  const displayData =
    visitsData.length > 7
      ? [...visitsData].sort((a, b) => b.visits - a.visits).slice(0, 7)
      : visitsData;

  const chartColor = "hsl(var(--chart-3))";

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">
          Top Surveys by Visits
        </CardTitle>
        <CardDescription>
          {visitsData.length > 7 ? "Top 7 surveys" : "Surveys"} that attracted
          the most visitors
        </CardDescription>
      </CardHeader>

      <CardContent className="h-72 pt-4">
        {visitsData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-muted-foreground">
              No visit data available
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={displayData}
              margin={{ top: 10, right: 20, left: 20, bottom: 40 }}
            >
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fill: "hsl(var(--card-foreground))", fontSize: 12 }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "hsl(var(--card-foreground))", fontSize: 12 }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={(value) => {
                  if (value >= 1000) {
                    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
                  }
                  return value;
                }}
              />
              <Tooltip
                formatter={(value) => [value.toLocaleString(), "Visits"]}
                labelFormatter={(label) => {
                  const survey = displayData.find((s) => s.name === label);
                  return survey?.name || label;
                }}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  color: "hsl(var(--popover-foreground))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  padding: "0.75rem",
                }}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-sm font-medium">{value}</span>
                )}
                wrapperStyle={{
                  paddingTop: 20,
                  bottom: 0,
                  lineHeight: "10px",
                }}
              />
              <Area
                type="monotone"
                dataKey="visits"
                name="Visits"
                stroke={chartColor}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVisits)"
                activeDot={{ r: 6, stroke: "hsl(var(--card))", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
