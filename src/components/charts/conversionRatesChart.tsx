import * as React from "react";
import {
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export function ConversionRatesChart({
  conversionData = [] as { name: string; value: number }[],
}) {
  console.log(conversionData, "TOP DATA");
  const CHART_COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const topData = React.useMemo(
    () => [...conversionData].sort((a, b) => b.value - a.value).slice(0, 5),
    [conversionData]
  );

  const totalConversions = React.useMemo(
    () => topData.reduce((acc, curr) => acc + curr.value, 0),
    [topData]
  );

  const renderCustomizedLabel = ({ viewBox }: { viewBox: any }) => {
    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
      return (
        <text
          x={viewBox.cx}
          y={viewBox.cy}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          <tspan
            x={viewBox.cx}
            y={viewBox.cy}
            className="fill-foreground text-3xl font-bold"
          >
            {totalConversions.toLocaleString()}
          </tspan>
          <tspan
            x={viewBox.cx}
            y={(viewBox.cy || 0) + 24}
            className="fill-muted-foreground"
          >
            Conversions
          </tspan>
        </text>
      );
    }
  };

  return (
    <Card className="flex flex-col shadow-md">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-semibold">
          Highest Conversion Rates
        </CardTitle>
        <CardDescription>
          Top 5 surveys by submission-to-visit ratio
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {topData.length === 0 ? (
          <div className="flex items-center justify-center h-72">
            <p className="text-center text-muted-foreground">
              No conversion data available
            </p>
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={250}
            className="mx-auto aspect-square"
          >
            <PieChart>
              <Tooltip
                formatter={(value) => [
                  `${typeof value === "number" ? value.toFixed(1) : value}%`,
                  "Conversion Rate",
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  color: "hsl(var(--popover-foreground))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  padding: "0.5rem",
                }}
              />
              <Pie
                data={topData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                strokeWidth={5}
                label={renderCustomizedLabel}
                paddingAngle={2}
              >
                {topData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                    stroke="hsl(var(--card))"
                  />
                ))}
              </Pie>
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                className="flex text-wrap"
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) =>
                  value.length > 15 ? `${value.substring(0, 15)}...` : value
                }
                iconSize={10}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing top conversion rates
        </div>
      </CardFooter>
    </Card>
  );
}
