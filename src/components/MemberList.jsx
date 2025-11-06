import { useEffect, useState } from "react";
import MemberCard from "./MemberCard";

export default function MemberList({ adminMode }) {
  const [members, setMembers] = useState([]);
  const [windowSeconds, setWindowSeconds] = useState(10);
  const base = import.meta.env.VITE_BACKEND_URL || "";

  const load = async () => {
    const res = await fetch(`${base}/api/members`);
    const data = await res.json();
    setMembers(data);
    // read window from any member qrs in a cheap way
    if (data[0]) {
      const qr = await fetch(`${base}/api/members/${data[0]._id}/qrs`).then((r) => r.json());
      setWindowSeconds(qr.window_seconds || 10);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 4000); // refresh status
    return () => clearInterval(t);
  }, []);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((m) => (
        <MemberCard key={m._id} member={m} windowSeconds={windowSeconds} onScan={load} />
      ))}
      {members.length === 0 && (
        <div className="text-gray-500 text-sm">No members yet. Use the form above to add one.</div>
      )}
    </div>
  );
}
