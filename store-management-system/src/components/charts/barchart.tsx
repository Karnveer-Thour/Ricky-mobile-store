"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

function MetricSummaryChart({ data, isDark = true }: MetricBarChartProps) {
  const colorMap = {
    Sales: isDark ? "#00cfff" : "#0284c7",
    Customers: isDark ? "#10b981" : "#059669",
    Products: isDark ? "#f59e0b" : "#d97706",
    Payments: isDark ? "#a855f7" : "#7c3aed",
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: -10,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
            vertical={false}
          />
          <XAxis
            dataKey="metric"
            stroke={isDark ? "#64748b" : "#94a3b8"}
            tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }}
            tickLine={false}
            axisLine={{
              stroke: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
            }}
          />
          <YAxis
            stroke={isDark ? "#64748b" : "#94a3b8"}
            tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }}
            tickLine={false}
            axisLine={{
              stroke: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#0f172a" : "#ffffff",
              borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
              borderRadius: "12px",
              boxShadow: isDark
                ? "0 10px 25px -5px rgba(0,0,0,0.5)"
                : "0 10px 25px -5px rgba(0,0,0,0.1)",
              color: isDark ? "#f8fafc" : "#0f172a",
              fontSize: "12px",
              fontWeight: "600",
            }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
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

