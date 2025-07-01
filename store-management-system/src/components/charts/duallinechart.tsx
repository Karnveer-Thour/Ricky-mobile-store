import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type chartData = {
  name: string,
  uv: number,
  pv: number,
  amt: number,
}

interface lineChartProps {
  data: chartData[],
  isDark?: boolean,
}

function DualLineChart({data,isDark}:lineChartProps) {
   return (
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
          <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
}

export default DualLineChart
