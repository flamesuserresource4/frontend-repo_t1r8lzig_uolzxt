import { useEffect, useMemo, useState } from "react";
import { Clock, BadgeCheck } from "lucide-react";

function useCountdown(seconds) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return Math.floor(Date.now() / 1000) % seconds; // changes each second
}

export default function MemberCard({ member, windowSeconds, onScan }) {
  const refreshKey = useCountdown(windowSeconds || 10);

  // Simulate QR data by generating dynamic token text shown as a mini QR placeholder
  const inPayload = useMemo(
    () => ({ member_id: member._id, action: "IN" }),
    [member._id, refreshKey]
  );
  const outPayload = useMemo(
    () => ({ member_id: member._id, action: "OUT" }),
    [member._id, refreshKey]
  );

  const statusColor = member.present ? "text-green-600" : "text-gray-500";

  const timeFmt = (iso) => (iso ? new Date(iso).toLocaleTimeString() : "—");

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
          <p className={`text-sm ${statusColor}`}>{member.present ? "Present" : "Absent"}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock size={14} /> refreshes live
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <QRBox label="IN" color="from-emerald-500 to-emerald-600" payload={inPayload} onScan={onScan} />
        <QRBox label="OUT" color="from-rose-500 to-rose-600" payload={outPayload} onScan={onScan} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div className="rounded-lg bg-gray-50 p-2">
          <div className="text-[11px] uppercase tracking-wide text-gray-500">IN time</div>
          <div className="font-medium">{timeFmt(member.last_in)}</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-2">
          <div className="text-[11px] uppercase tracking-wide text-gray-500">OUT time</div>
          <div className="font-medium">{timeFmt(member.last_out)}</div>
        </div>
      </div>
    </div>
  );
}

function QRBox({ label, color, payload, onScan }) {
  // Minimal on-page scanner simulation: clicking triggers scan to backend
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(null);

  const handleClick = async () => {
    try {
      setLoading(true);
      setOk(null);
      const base = import.meta.env.VITE_BACKEND_URL || "";
      // Get a fresh token
      const qrResp = await fetch(`${base}/api/members/${payload.member_id}/qrs`).then((r) => r.json());
      const token = payload.action === "IN" ? qrResp.in.token : qrResp.out.token;

      const res = await fetch(`${base}/api/scan2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, token }),
      });
      const data = await res.json();
      setOk(res.ok);
      onScan?.();
    } catch (e) {
      setOk(false);
    } finally {
      setLoading(false);
      setTimeout(() => setOk(null), 1200);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`relative rounded-xl border p-3 text-left group overflow-hidden`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10`} />
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-800">{label}</span>
        {ok === true && <BadgeCheck className="text-emerald-600" size={16} />}
        {ok === false && <span className="text-rose-600 text-xs">Failed</span>}
      </div>
      <div className="mt-2 h-28 w-full rounded-lg bg-[repeating-linear-gradient(45deg,#000_0_2px,#fff_2px_4px)] grid place-items-center">
        <span className="text-[10px] bg-white/80 px-2 py-1 rounded border">Dynamic QR</span>
      </div>
      <div className="mt-2 text-[10px] text-gray-500">Tap to simulate scan</div>
    </button>
  );
}
