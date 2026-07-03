import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useApp } from "../AppContext";
import { Clock, Truck, CheckCircle2, MapPin, Phone, Shield } from "lucide-react";
import { fmt } from "../data";

// ─── Types & Config ─────────────────────────────────────────────────────────

type StepStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const STEPS = [
  { id: "confirmed", label: "Confirmed" },
  { id: "packaging", label: "Packaging" },
  { id: "transit", label: "In Transit" },
  { id: "doorstep", label: "Doorstep" },
];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trackedOrderId, setTrackedOrderId } = useApp();

  const [orderStatus, setOrderStatus] = useState<StepStatus>("SHIPPED");
  const [activeStep, setActiveStep] = useState(2); // In Transit

  // GPS coordinates & tracking simulation
  const [riderCoords, setRiderCoords] = useState<{ lat: number; lng: number }>({
    lat: 30.7046, // Khanna, Punjab start
    lng: 76.2163,
  });
  const [lastUpdated, setLastUpdated] = useState(0);
  const [gpsLost, setGpsLost] = useState(false);
  const [simTick, setSimTick] = useState(0);
  const [transitStatus, setTransitStatus] = useState<"normal" | "delayed">("normal");
  const [delayReason, setDelayReason] = useState("");

  // Handover state
  const [isRiderClose, setIsRiderClose] = useState(false);
  const [deliveryOtp, setDeliveryOtp] = useState("");
  const [handoverSuccess, setHandoverSuccess] = useState(false);

  // Map elements refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const riderMarkerRef = useRef<any>(null);
  const lineRef = useRef<any>(null);

  // Khanna static destination coordinates
  const destinationCoords = { lat: 30.7090, lng: 76.2220 };

  // Load Leaflet dynamically
  useEffect(() => {
    let isMounted = true;
    const linkId = "leaflet-css";
    const scriptId = "leaflet-js";

    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (!mapContainerRef.current || mapInstanceRef.current || !(window as any).L) return;
      const L = (window as any).L;

      // Create map
      const map = L.map(mapContainerRef.current).setView([30.7068, 76.2191], 14);
      mapInstanceRef.current = map;

      // Add OSM tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Custom markers
      const riderIcon = L.divIcon({
        className: "bg-[var(--color-ricky-accent-blue)] text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-[var(--shadow-ricky-md)] animate-pulse",
        html: "🛵",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const destIcon = L.divIcon({
        className: "bg-[var(--color-ricky-accent-red)] text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-[var(--shadow-ricky-md)]",
        html: "📍",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      // Add pins
      L.marker([destinationCoords.lat, destinationCoords.lng], { icon: destIcon }).addTo(map);
      const riderMarker = L.marker([riderCoords.lat, riderCoords.lng], { icon: riderIcon }).addTo(map);
      riderMarkerRef.current = riderMarker;

      // Draw route path line
      const routeLine = L.polyline(
        [
          [riderCoords.lat, riderCoords.lng],
          [destinationCoords.lat, destinationCoords.lng],
        ],
        { color: "var(--color-ricky-accent-blue)", weight: 4, opacity: 0.6 }
      ).addTo(map);
      lineRef.current = routeLine;
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => {
        if (isMounted) initMap();
      };
      document.body.appendChild(script);
    } else {
      // Leaflet script already exists, check if loaded
      const interval = setInterval(() => {
        if ((window as any).L) {
          initMap();
          clearInterval(interval);
        }
      }, 100);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Poll GPS simulator (every 10 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(0);
      const nextTick = simTick + 1;
      setSimTick(nextTick);

      let nextLat = riderCoords.lat;
      let nextLng = riderCoords.lng;

      if (nextTick === 2 || nextTick === 3) {
        setTransitStatus("delayed");
        setDelayReason("Rider stuck in heavy traffic near Grand Trunk Road (Est. 5-8 min delay) 🌧️");
      } else {
        setTransitStatus("normal");
        setDelayReason("");
        // Simulation steps moving rider closer to Khanna destination
        nextLat = riderCoords.lat + (destinationCoords.lat - riderCoords.lat) * 0.25;
        nextLng = riderCoords.lng + (destinationCoords.lng - riderCoords.lng) * 0.25;

        // Add minor random wiggle
        nextLat += (Math.random() - 0.5) * 0.0003;
        nextLng += (Math.random() - 0.5) * 0.0003;
      }

      // Update leaflet pin
      const L = (window as any).L;
      if (riderMarkerRef.current && L) {
        const nextLatLng = new L.LatLng(nextLat, nextLng);
        riderMarkerRef.current.setLatLng(nextLatLng);

        if (lineRef.current) {
          lineRef.current.setLatLngs([
            [nextLat, nextLng],
            [destinationCoords.lat, destinationCoords.lng],
          ]);
        }
      }

      setRiderCoords({ lat: nextLat, lng: nextLng });

      // If close to destination (< 100m estimation)
      const latDiff = Math.abs(nextLat - destinationCoords.lat);
      const lngDiff = Math.abs(nextLng - destinationCoords.lng);
      if (latDiff < 0.0015 && lngDiff < 0.0015) {
        setIsRiderClose(true);
        setActiveStep(3); // Doorstep milestone active
        if (mapInstanceRef.current && L) {
          mapInstanceRef.current.setView([destinationCoords.lat, destinationCoords.lng], 16);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [riderCoords, simTick]);

  // Last updated seconds ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVerifyOtp = () => {
    if (deliveryOtp === "1234") {
      setHandoverSuccess(true);
      setOrderStatus("DELIVERED");
      setActiveStep(3);
    } else {
      alert("Invalid Handover OTP! Hint: Use 1234");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <span className="text-xs text-[#00cfff] font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>
            ORDER IN PROGRESS
          </span>
          <h1
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            className="text-4xl font-extrabold text-white tracking-widest uppercase mt-1"
          >
            Track Order #{id || trackedOrderId || "RMS-TEMP"}
          </h1>
        </div>
        <button
          onClick={() => navigate("/orders")}
          className="px-4 py-2 border border-white/10 text-white rounded-xl text-xs hover:bg-white/5"
        >
          My Orders
        </button>
      </div>

      {/* trk-001: Milestone progress tracker */}
      <div className="bg-[#0e0e1c] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          {STEPS.map((s, idx) => {
            const isDone = idx < activeStep || handoverSuccess;
            const isCurrent = idx === activeStep && !handoverSuccess;
            return (
              <div key={s.id} className="flex flex-col items-center flex-1 relative">
                {/* Connector line */}
                {idx < STEPS.length - 1 && (
                  <div
                    className={`absolute top-4 left-1/2 w-full h-[2px] -z-10 ${
                      idx < activeStep ? "bg-[var(--color-ricky-accent-green-light)]" : "bg-white/5"
                    }`}
                  />
                )}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                    isDone
                      ? "bg-[var(--color-ricky-accent-green-light)] border-[var(--color-ricky-accent-green-light)] text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                      : isCurrent
                      ? "bg-[#00cfff] border-[#00cfff] text-[#07070f] animate-pulse"
                      : "bg-[#0e0e1c] border-white/10 text-gray-700"
                  }`}
                >
                  {isDone ? "✓" : idx + 1}
                </div>
                <span
                  className={`text-xs mt-3 font-semibold ${
                    isDone || isCurrent ? "text-white" : "text-gray-700"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* map-001: Live Map Canvas View */}
      <div className="bg-[#0e0e1c] border border-white/5 rounded-3xl overflow-hidden relative shadow-[var(--shadow-ricky-md)]">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-ricky-accent-blue)] animate-pulse" />
            <span className="text-xs font-semibold text-white">Live Tracking Canvas</span>
          </div>
          <span className="text-[10px] text-gray-700 font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>
            {gpsLost ? "Signal lost" : `Rider position updated ${lastUpdated}s ago`}
          </span>
        </div>

        {/* Delay alert banner */}
        {transitStatus === "delayed" && (
          <div className="mx-5 mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3 animate-pulse">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="text-xs font-bold text-amber-400">Transit Delay Alert</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{delayReason}</p>
            </div>
          </div>
        )}

        {/* Map Canvas */}
        <div
          ref={mapContainerRef}
          className="w-full h-[320px] bg-[#141425]"
          role="img"
          aria-label="Live delivery map showing rider location"
        />

        {/* Courier details badge overlay inside courier container */}
        <div className="p-5 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/4 flex items-center justify-center text-lg">
              🛵
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Harpreet Singh</p>
              <p className="text-xs text-gray-600">Honda Activa · PB10-XXXX</p>
            </div>
          </div>
          <a
            href="tel:+919876543210"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/4 border border-white/8 hover:bg-white/8 text-white rounded-xl text-xs font-bold transition-all"
          >
            <Phone size={12} /> Contact Courier
          </a>
        </div>
      </div>

      {/* OTP verification box when rider is within 100m */}
      {isRiderClose && !handoverSuccess && (
        <div className="p-6 bg-[var(--color-ricky-accent-green)]/10 border-2 border-[var(--color-ricky-accent-green)] rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-[var(--color-ricky-accent-green-light)]">
            <CheckCircle2 size={18} />
            <h3 className="font-bold text-sm">Courier Has Arrived at Doorstep!</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Please share the 4-digit Handover OTP with Harpreet to complete verification and receive your device.
          </p>

          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              maxLength={4}
              value={deliveryOtp}
              onChange={(e) => setDeliveryOtp(e.target.value)}
              placeholder="Enter Handover OTP (e.g. 1234)"
              className="flex-1 bg-[#0e0e1c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-ricky-accent-green)]"
            />
            <button
              onClick={handleVerifyOtp}
              className="px-5 py-2.5 bg-[var(--color-ricky-accent-green)] text-white font-bold rounded-xl text-xs hover:bg-[var(--color-ricky-accent-green-light)]"
            >
              Verify OTP
            </button>
          </div>
        </div>
      )}

      {handoverSuccess && (
        <div className="p-6 bg-green-500/10 border-2 border-green-500/30 rounded-3xl text-center space-y-2">
          <h3 className="font-bold text-green-400">🎉 Order Delivered Successfully!</h3>
          <p className="text-xs text-gray-600">
            Thank you for shopping at Ricky Mobile Store. Enjoy your new smartphone!
          </p>
        </div>
      )}
    </div>
  );
}
