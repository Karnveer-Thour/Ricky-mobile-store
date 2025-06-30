"use client";

import SimpleLineChart from "@/components/charts/simplelinechart";
import CountCard from "@/components/countcard";
import { storeType } from "@/types/store.index";
import { useSelector } from "react-redux";

const lineChartData = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

function page() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  return (
    <>
      <div className=" w-[93%] overflow-hidden sm:ms-10 me-9 mt-8 max-sm:ms-4 h-auto flex max-sm:flex-col max-sm:justify-center items-center gap-4">
        <p className={`text-3xl ${isDark ? "text-white" : "text-gray-700"} `}>
          Dashboard
        </p>
        <hr
          className={`border-t-3 ${isDark ? "text-gray-100" : "text-gray-700"} mt-1 flex-1`}
        ></hr>
      </div>
      <div className="h-50 mt-4 flex justify-center items-center">
        <div className="h-full w-[90%] flex items-center justify-evenly">
         <CountCard isDark={isDark} title="Cutomers" count={44}/>
         <CountCard isDark={isDark} title="Total Sale" count={107}/>
         <CountCard isDark={isDark} title="Pending orders" count={89}/>
         <CountCard isDark={isDark} title="Accepted orders" count={87}/>
        </div>
      </div>
      <p className="text-center mt-1 text-3xl">Sales and customers</p>
      <div className="h-150 mt-1 flex justify-center items-center">
        <div className="w-[95%] h-full flex justify-between items-center py-5"> 
          <div className="shadow-md bg-white w-[50%] h-full rounded-2xl p-3">
            <p className="mb-1 ms-3 text-2xl">Current year sales and customers</p>
             <hr
          className={`border-t-3 ${isDark ? "text-gray-100" : "text-gray-700"} mb-2 flex-1`}
        ></hr>
        <div className="h-[93%] w-full">
            <SimpleLineChart isDark={isDark} data={lineChartData}/>
        </div>
          </div>
          <div className="shadow-md bg-white w-[40%] h-full rounded-2xl"></div>
        </div>
      </div>
      <p className="text-center mt-1 text-3xl">Current year record</p>
      <div className="h-100 mt-2 mb-5 flex justify-center items-center">
        <div className="w-[95%] h-full flex justify-between items-center py-5"> 
          <div className="shadow-md bg-white w-[45%] h-full rounded-2xl"></div>
          <div className="shadow-md bg-white w-[45%] h-full rounded-2xl"></div>
        </div>
      </div>
    </>
  );
}

export default page;
