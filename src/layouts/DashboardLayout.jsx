import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDashboardStats } from '@club/hooks/useDashboardStats';
import Navbar from '@/layouts/components/Navbar';
import Sidebar from '@/layouts/components/Sidebar';

function DashboardLayout() {
  const [isDesktop, setIsDesktop] = useState(
    () => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : true),
  );
  const [isDesktopSidebarExpanded, setIsDesktopSidebarExpanded] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const dashboard = useDashboardStats();

  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth >= 1024);
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarWidthClass = isDesktopSidebarExpanded
    ? 'lg:grid-cols-[320px_minmax(0,1fr)]'
    : 'lg:grid-cols-[84px_minmax(0,1fr)]';

  function handleSidebarToggle() {
    if (isDesktop) {
      setIsDesktopSidebarExpanded((current) => !current);
      return;
    }

    setIsMobileSidebarOpen((current) => !current);
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      {isDesktop ? (
        <div
          className={[
            'grid min-h-screen',
            sidebarWidthClass,
          ].join(' ')}
        >
          <Sidebar
            dashboard={dashboard}
            isDesktop
            isDesktopExpanded={isDesktopSidebarExpanded}
            isMobileOpen={false}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            onToggleDesktop={() => setIsDesktopSidebarExpanded((current) => !current)}
          />

          <div className="min-w-0">
            <Navbar
              dashboard={dashboard}
              isDesktop
              onMenuToggle={handleSidebarToggle}
            />

            <main className="min-w-0 px-6 py-8 lg:px-8 xl:px-10">
              <Outlet context={dashboard} />
            </main>
          </div>
        </div>
      ) : (
        <div className="min-h-screen">
          <Navbar
            dashboard={dashboard}
            isDesktop={false}
            onMenuToggle={handleSidebarToggle}
          />

          <Sidebar
            dashboard={dashboard}
            isDesktop={false}
            isDesktopExpanded={false}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            onToggleDesktop={() => setIsDesktopSidebarExpanded((current) => !current)}
          />

          <main className="min-w-0 px-4 py-5 sm:px-6">
            <Outlet context={dashboard} />
          </main>
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;
