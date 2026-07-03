import { useState, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Lender = "bajaj" | "homecredit";
type Tenure = 3 | 6 | 9 | 12;

interface AffordabilityWidgetProps {
  /** Full product price in INR */
  price: number;
  /** Called when user taps the CTA — passes selected lender + tenure */
  onCheckout: (lender: Lender, tenure: Tenure) => void;
  /** Called when user taps "Chat with us" on gateway timeout */
  onSupportChat: () => void;
  /** Whether to show compact badge-only variant (Catalog cards) */
  compact?: boolean;
}

// ─── EMI Config ──────────────────────────────────────────────────────────────

const LENDER_CONFIG: Record<Lender, { label: string; downPctg: number; feePctg: number }> = {
  bajaj:      { label: "Bajaj Finserv", downPctg: 0,    feePctg: 0.02 },
  homecredit: { label: "Home Credit",   downPctg: 0.10, feePctg: 0.015 },
};

const TENURES: Tenure[] = [3, 6, 9, 12];

function calcEMI(price: number, lender: Lender, tenure: Tenure) {
  const { downPctg, feePctg } = LENDER_CONFIG[lender];
  const down = Math.round(price * downPctg);
  const fee  = Math.round(price * feePctg);
  const monthly = Math.round((price - down + fee) / tenure);
  return { down, fee, monthly };
}

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

// ─── Compact Badge ────────────────────────────────────────────────────────────

export function AffordabilityBadge({ price }: { price: number }) {
  const { monthly } = calcEMI(price, "bajaj", 12);
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--color-ricky-accent-green)] text-white">
      {fmt(monthly)}/mo · 12m EMI
    </span>
  );
}

// ─── Full Widget ──────────────────────────────────────────────────────────────

export default function AffordabilityWidget({
  price,
  onCheckout,
  onSupportChat,
  compact = false,
}: AffordabilityWidgetProps) {
  const [lender, setLender] = useState<Lender>("bajaj");
  const [tenure, setTenure] = useState<Tenure>(12);
  const [loading, setLoading] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  const { down, fee, monthly } = calcEMI(price, lender, tenure);

  // Simulate gateway timeout behaviour (8s hard limit)
  const handleCheckout = useCallback(() => {
    setLoading(true);
    setTimedOut(false);

    // Simulated API call path
    const successTimeout = setTimeout(() => {
      setLoading(false);
      onCheckout(lender, tenure);
    }, 1500);

    // 8-second backup warning/timeout is cleared if success occurs first.
    return () => {
      clearTimeout(successTimeout);
    };
  }, [lender, tenure, onCheckout]);

  if (compact) return <AffordabilityBadge price={price} />;

  return (
    <div
      className="ricky-glass rounded-[var(--radius-ricky-md)] p-4 w-full"
      role="region"
      aria-label="EMI Affordability Calculator"
    >
      {/* ── Lender tabs ── */}
      <div className="flex gap-2 mb-4" role="tablist" aria-label="Select lender">
        {(Object.keys(LENDER_CONFIG) as Lender[]).map((l) => (
          <button
            key={l}
            role="tab"
            aria-selected={lender === l}
            onClick={() => { setLender(l); setTimedOut(false); }}
            className={[
              "flex-1 py-2 px-3 rounded-[var(--radius-ricky-sm)] text-sm font-semibold transition-all",
              "duration-[var(--ease-ricky-fast)]",
              lender === l
                ? "bg-[var(--color-ricky-accent-blue)] text-white"
                : "bg-[var(--color-ricky-primary-700)] text-[var(--color-ricky-text-muted)] hover:text-white",
            ].join(" ")}
          >
            {LENDER_CONFIG[l].label}
          </button>
        ))}
      </div>

      {/* ── Tenure chips ── */}
      <div className="flex gap-2 mb-5" role="radiogroup" aria-label="Select tenure">
        {TENURES.map((t) => (
          <button
            key={t}
            role="radio"
            aria-checked={tenure === t}
            onClick={() => { setTenure(t); setTimedOut(false); }}
            className={[
              "flex-1 py-1.5 rounded-[var(--radius-ricky-sm)] text-sm font-semibold transition-all",
              "duration-[var(--ease-ricky-fast)]",
              tenure === t
                ? "bg-[var(--color-ricky-accent-green)] text-white"
                : "bg-[var(--color-ricky-primary-700)] text-[var(--color-ricky-text-muted)] hover:text-white",
            ].join(" ")}
          >
            {t}m
          </button>
        ))}
      </div>

      {/* ── Cost breakdown ── */}
      <div
        className="space-y-2 mb-5"
        aria-live="polite"
        aria-label="EMI cost breakdown"
      >
        <div className="flex justify-between text-sm text-[var(--color-ricky-text-muted)]">
          <span>Down payment</span>
          <span className="font-semibold text-white">{down === 0 ? "₹0 (Zero)" : fmt(down)}</span>
        </div>
        <div className="flex justify-between text-sm text-[var(--color-ricky-text-muted)]">
          <span>Processing fee</span>
          <span className="font-semibold text-white">{fmt(fee)}</span>
        </div>
        <div className="flex justify-between border-t border-white/10 pt-2">
          <span className="text-[var(--color-ricky-text-muted)] text-sm">Monthly installment</span>
          <span className="text-2xl font-extrabold text-white">
            {fmt(monthly)}<span className="text-sm font-normal text-[var(--color-ricky-text-muted)]">/mo</span>
          </span>
        </div>
      </div>

      {/* ── Timeout error card ── */}
      {timedOut && (
        <div className="mb-4 p-3 rounded-[var(--radius-ricky-sm)] bg-[var(--color-ricky-accent-amber)]/10 border border-[var(--color-ricky-accent-amber)] text-sm">
          <p className="text-[var(--color-ricky-accent-amber)] font-semibold mb-1">
            Gateway is taking too long
          </p>
          <p className="text-[var(--color-ricky-text-muted)] mb-2">
            The EMI check is delayed. Chat with Ricky directly and we'll sort it out.
          </p>
          <button
            onClick={onSupportChat}
            className="text-[var(--color-ricky-accent-blue)] font-semibold underline text-sm"
          >
            Chat with support →
          </button>
        </div>
      )}

      {/* ── CTA button ── */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        aria-busy={loading}
        className={[
          "w-full py-3.5 rounded-[var(--radius-ricky-full)] text-base font-bold text-white",
          "transition-all duration-[var(--ease-ricky-fast)]",
          loading
            ? "bg-[var(--color-ricky-primary-700)] cursor-not-allowed"
            : "bg-[var(--color-ricky-accent-blue)] hover:bg-[#1D4ED8] active:scale-[0.98] shadow-[var(--shadow-ricky-sm)]",
        ].join(" ")}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Checking eligibility…
          </span>
        ) : (
          "Calculate EMI & Checkout"
        )}
      </button>
    </div>
  );
}
