import { useEffect, useState } from "react";
import Header from "./components/Header";
import AddMemberForm from "./components/AddMemberForm";
import MemberList from "./components/MemberList";
import AdminPanel from "./components/AdminPanel";

function App() {
  const [adminMode, setAdminMode] = useState(true);
  const toggleAdmin = () => setAdminMode((v) => !v);

  // Ping backend to ensure connectivity on load
  useEffect(() => {
    fetch((import.meta.env.VITE_BACKEND_URL || "") + "/").catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Header adminMode={adminMode} onToggleAdmin={toggleAdmin} />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <AddMemberForm onCreated={() => {}} />
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Members</h2>
            <p className="text-sm text-gray-500">Dynamic QR refreshes every 5–10s</p>
          </div>
          <MemberList adminMode={adminMode} />
        </section>

        {adminMode && (
          <section>
            <AdminPanel />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
