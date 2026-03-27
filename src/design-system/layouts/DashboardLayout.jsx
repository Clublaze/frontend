import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        {/* Sidebar navigation */}
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          {/* Top bar */}
        </header>
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
