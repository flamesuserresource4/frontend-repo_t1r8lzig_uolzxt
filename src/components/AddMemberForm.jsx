import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";

export default function AddMemberForm({ onCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const base = import.meta.env.VITE_BACKEND_URL || "";

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await fetch(`${base}/api/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      setName("");
      onCreated?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-xl border bg-white p-4 shadow-sm flex items-end gap-3">
      <div className="flex-1">
        <label className="text-xs text-gray-600">Member name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Alex Johnson"
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
        />
      </div>
      <button
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add
      </button>
    </form>
  );
}
