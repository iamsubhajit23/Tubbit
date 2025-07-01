import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "./ui/Sidebar.jsx";
import AppSidebar from "./AppSidebar.jsx";
import { Navbar } from "./header/Navbar.jsx";
import App from "../App.jsx";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <App />
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
