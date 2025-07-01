"use client";

import MetricSummaryChart, {
  metricSummaryChartTypes,
} from "@/components/charts/barchart";
import DualLineChart from "@/components/charts/duallinechart";
import SingleLineChart from "@/components/charts/singlelinechart";
import CountCard from "@/components/countcard";
import { storeType } from "@/types/store.index";
import { useSelector } from "react-redux";

const lineChartData = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
];

const singleLineChartData = [
  { name: "Page A", pv: 2400, amt: 2400 },
  { name: "Page B", pv: 1398, amt: 2210 },
  { name: "Page C", pv: 9800, amt: 2290 },
  { name: "Page D", pv: 3908, amt: 2000 },
  { name: "Page E", pv: 4800, amt: 2181 },
  { name: "Page F", pv: 3800, amt: 2500 },
  { name: "Page G", pv: 4300, amt: 2100 },
];

const metricBarChartData = [
  { metric: metricSummaryChartTypes.Sales, value: 24000 },
  { metric: metricSummaryChartTypes.Customers, value: 1200 },
  { metric: metricSummaryChartTypes.Payments, value: 340 },
  { metric: metricSummaryChartTypes.Products, value: 18000 },
];

function page() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);

  return (
    <>
      <div className="w-[93%] overflow-hidden sm:ms-10 me-9 mt-8 max-sm:ms-4 h-auto flex max-sm:flex-col max-sm:justify-center items-center gap-4">
        <p
          className={`text-3xl font-semibold ${isDark ? "text-white" : "text-gray-700"}`}
        >
          Dashboard
        </p>
        <hr
          className={`border-t-3 ${isDark ? "border-gray-100" : "border-gray-700"} mt-1 flex-1`}
        />
      </div>

      <div className="h-50 mt-4 flex justify-center items-center">
        <div className="h-full w-[90%] flex items-center justify-evenly">
          <CountCard isDark={isDark} title="Cutomers" count={44} />
          <CountCard isDark={isDark} title="Total Sale" count={107} />
          <CountCard isDark={isDark} title="Pending orders" count={89} />
          <CountCard isDark={isDark} title="Accepted orders" count={87} />
        </div>
      </div>

      <p
        className={`text-left mt-6 ms-10 text-2xl font-semibold underline ${isDark ? "text-white" : "text-gray-800"}`}
      >
        Sales and Customers
      </p>

      <div className="h-150 mt-1 flex justify-center items-center">
        <div className="w-[95%] h-full flex justify-between items-center py-5">
          <div
            className={`shadow-md ${
              isDark ? "bg-gray-900" : "bg-white"
            } w-[50%] h-full rounded-2xl p-3`}
          >
            <p
              className={`mb-2 ms-3 text-2xl font-semibold ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Current year sales and customers
            </p>
            <hr
              className={`border-t-3 ${
                isDark ? "border-gray-600" : "border-gray-300"
              } mb-2 flex-1`}
            />
            <div className="h-[93%] w-full">
              <DualLineChart isDark={isDark} data={lineChartData} />
            </div>
          </div>

          <div
            className={`shadow-md ${
              isDark ? "bg-gray-900" : "bg-white"
            } w-[43%] h-full rounded-2xl p-3`}
          >
            <p
              className={`mb-1 ms-3 text-2xl font-semibold ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Recent Sales
            </p>
            <hr
              className={`border-t-3 ${
                isDark ? "border-gray-600" : "border-gray-300"
              } mb-2 flex-1`}
            />

            <div className="h-[93%] w-full overflow-y-auto px-2">
              {/* Table Header */}
              <div
                className={`grid grid-cols-3 font-semibold text-sm py-2 px-2 border-b ${
                  isDark ? "text-gray-300 border-gray-700" : "text-gray-600"
                }`}
              >
                <div>#</div>
                <div>Amount</div>
                <div>Status</div>
              </div>

              {/* Table Rows */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 55, 332, 523, 52].map(
                (item, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-3 text-sm items-center py-2 px-2 border-b transition-colors ${
                      isDark
                        ? "text-gray-300 border-gray-700 hover:bg-gray-800"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium">{index + 1}</div>
                    <div>₹{item.toLocaleString()}</div>
                    <div>
                      <span className="text-green-600 font-semibold">
                        Completed
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <p
        className={`text-left mt-6 ms-10 text-2xl font-semibold underline ${isDark ? "text-white" : "text-gray-800"}`}
      >
        Current year record
      </p>

      <div className="h-150 mt-2 mb-5 flex justify-center items-center">
        <div className="w-[95%] h-full flex justify-between items-center py-5">
          <div
            className={`shadow-md ${
              isDark ? "bg-gray-900" : "bg-white"
            } w-[50%] h-full rounded-2xl p-3`}
          >
            <p
              className={`mb-2 ms-3 text-2xl font-semibold ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Current year sales
            </p>
            <hr
              className={`border-t-3 ${
                isDark ? "border-gray-600" : "border-gray-300"
              } mb-2 flex-1`}
            />
            <div className="h-[93%] w-full">
              <SingleLineChart isDark={isDark} data={singleLineChartData} />
            </div>
          </div>

          <div
            className={`shadow-md ${
              isDark ? "bg-gray-900" : "bg-white"
            } w-[45%] h-full rounded-2xl p-3`}
          >
            <p
              className={`mb-2 ms-3 text-2xl font-semibold ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Current year Record
            </p>
            <hr
              className={`border-t-3 ${
                isDark ? "border-gray-600" : "border-gray-300"
              } mb-2 flex-1`}
            />
            <div className="h-[93%] w-full flex justify-center items-center">
              <MetricSummaryChart isDark={isDark} data={metricBarChartData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
