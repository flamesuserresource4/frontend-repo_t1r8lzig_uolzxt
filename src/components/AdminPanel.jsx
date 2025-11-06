import { useEffect, useMemo, useState } from "react";
import { History, RefreshCcw } from "lucide-react";

export default function AdminPanel() {
  const base = import.meta.env.VITE_BACKEND_URL || "";
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMembers = async () => {
    const res = await fetch(`${base}/api/members`);
    setMembers(await res.json());
  };
  const loadHistory = async (id) => {
    if (!id) return setHistory([]);
    const res = await fetch(`${base}/api/members/${id}/attendance`);
    setHistory(await res.json());
  };

  useEffect(() => {
    loadMembers();
  }, []);
  useEffect(() => {
    loadHistory(selected);
  }, [selected]);

  const selectedMember = useMemo(() => members.find((m) => m._id === selected), [members, selected]);

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <History size={18} className="text-indigo-600" />
          <h3 className="font-semibold">Attendance History</h3>
        </div>
        <button
          onClick={() => loadHistory(selected)}
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50"
        >
          <RefreshCcw size={14} /> Refresh
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="md:col-span-1">
          <label className="text-xs text-gray-600">Select member</label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">— Choose —</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
          {selectedMember && (
            <div className="mt-3 text-xs text-gray-600">
              <div>Current: {selectedMember.present ? "Present" : "Absent"}</div>
              <div>Last IN: {selectedMember.last_in ? new Date(selectedMember.last_in).toLocaleString() : "—"}</div>
              <div>Last OUT: {selectedMember.last_out ? new Date(selectedMember.last_out).toLocaleString() : "—"}</div>
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <div className="max-h-64 overflow-auto rounded-lg border bg-gray-50">
            <table className="w-full text-sm">
              <thead className="bg-white sticky top-0">
                <tr className="text-left text-xs text-gray-600">
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row) => (
                  <tr key={row._id} className="border-t bg-white">
                    <td className="px-3 py-2">{new Date(row.timestamp).toLocaleString()}</td>
                    <td className="px-3 py-2">{row.action}</td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-gray-500" colSpan={2}>
                      No records yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
