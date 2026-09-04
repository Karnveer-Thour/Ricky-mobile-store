"use client";
import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type chartData = {
  name: string;
  pv: number;
  amt: number;
};

interface SinglelineChartProps {
  data: chartData[];
  isDark?: boolean;
}

function SingleLineChart({ data, isDark = true }: SinglelineChartProps) {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
            dataKey="name"
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
            formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Valuation"]}
          />
          <Line
            type="monotone"
            name="Valuation"
            dataKey="pv"
            stroke={isDark ? "#38bdf8" : "#0284c7"}
            strokeWidth={2.5}
            dot={{ r: 3, fill: isDark ? "#38bdf8" : "#0284c7" }}
            activeDot={{ r: 6, fill: isDark ? "#38bdf8" : "#0284c7" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SingleLineChart;

