import MobbileNav from "../Features/dashboard/component/MobbileNav";
import SideBar from "../Features/dashboard/component/SideBar";
import Header from "../Features/dashboard/component/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Dashboard has its own sidebar + header so the global Navbar/Footer is
// hidden via the pathname check added in those components.
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <SideBar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header></Header>
        {/* Main content column: header + page content + footer */}
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="mx-auto w-full flex-1 space-y-8 p-4 pb-24 md:p-8 md:pb-8">
            {children}
          </main>
        </div>
      </div>
      {/* Mobile bottom nav (fixed, always on top) */}
      <MobbileNav />
    </div>
  );
}
