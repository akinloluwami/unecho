import { Outlet } from "@remix-run/react";
import { AppSidebar } from "~/components/app-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default Dashboard;
