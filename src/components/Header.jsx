import { User, Settings } from "lucide-react";

export default function Header({ onToggleAdmin, adminMode }) {
  return (
    <header className="w-full sticky top-0 z-20 bg-white/70 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Live Attendance</h1>
            <p className="text-xs text-gray-500">QR based IN / OUT</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleAdmin}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition ${adminMode ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"}`}
          >
            <Settings size={16} /> {adminMode ? "Admin On" : "Admin Off"}
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border bg-white text-gray-700 border-gray-200">
            <User size={16} /> Members
          </div>
        </div>
      </div>
    </header>
  );
}
