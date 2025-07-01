import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

export enum metricSummaryChartTypes {
  Sales = "Sales",
  Customers = "Customers",
  Products = "Products",
  Payments = "Payments",
}

type chartData = {
  metric: metricSummaryChartTypes;
  value: number;
};

interface MetricBarChartProps {
  data: chartData[];
  isDark?: boolean;
}

function MetricSummaryChart({ data, isDark }: MetricBarChartProps) {
  const colorMap = {
    Sales: "#3B82F6", // Blue
    Customers: "#10B981", // Emerald green
    Products: "#F59E0B", // Amber
    Payments: "#6366F1", // Indigo
  };
  return (
    <div
      className={`w-full h-full p-4 rounded-xl ${
        isDark ? "bg-gray-900" : "bg-white"
      }`}
    >
      <ResponsiveContainer width="100%" height={"100%"}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="metric" />
          <YAxis />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colorMap[entry.metric]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MetricSummaryChart;
