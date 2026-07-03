import { useNavigate } from "react-router";
import { MOCK_ORDERS, STATUS_CFG, fmt } from "../data";
import { ArrowLeft, Truck } from "lucide-react";

export default function OrdersPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-xl border border-white/8 text-gray-600 hover:text-white hover:border-white/15 transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <h1
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          className="text-4xl font-extrabold text-white tracking-widest"
        >
          MY ORDERS
        </h1>
      </div>

      <div className="space-y-4">
        {MOCK_ORDERS.map((order) => {
          const cfg = STATUS_CFG[order.status];
          const Icon = cfg.Icon;
          return (
            <div
              key={order.id}
              className="bg-[#0e0e1c] border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-4 gap-4">
                <div>
                  <p className="text-xs text-gray-700" style={{ fontFamily: "'DM Mono', monospace" }}>{order.id}</p>
                  <p className="text-sm text-gray-600 mt-1">{order.date}</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${cfg.bg} ${cfg.color} shrink-0`}>
                  <Icon size={12} />
                  <span className="text-xs font-bold">{cfg.label}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm gap-4">
                    <span className="text-gray-400 truncate">
                      {item.name}{" "}
                      <span className="text-gray-700 text-xs">({item.color}) ×{item.qty}</span>
                    </span>
                    <span className="text-white shrink-0" style={{ fontFamily: "'DM Mono', monospace" }}>
                      {fmt(item.price)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <p className="text-xs text-gray-700">
                  via <span className="text-gray-500 font-semibold">{order.payment}</span>
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/orders/${order.id}/track`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/8 text-xs text-gray-400 hover:text-[#00cfff] hover:border-[#00cfff]/25 transition-all font-semibold"
                  >
                    <Truck size={12} /> Track
                  </button>
                  <p className="font-bold text-white text-lg" style={{ fontFamily: "'DM Mono', monospace" }}>
                    {fmt(order.total)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
