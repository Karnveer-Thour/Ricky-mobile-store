import React from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";

type chartData = {
  name: string;
  pv: number;
  amt: number;
};

interface SinglelineChartProps {
  data: chartData[];
  isDark?: boolean;
}

function SingleLineChart({ data, isDark }: SinglelineChartProps) {
  return (
    <div
      className={`w-full h-full p-4 rounded-xl ${
        isDark ? "bg-gray-900" : "bg-white"
      }`}
    >
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={250}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
    </div>
  );
}

export default SingleLineChart;
