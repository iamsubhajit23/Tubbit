import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "./ui/Sidebar.jsx";
import AppSidebar from "./AppSidebar.jsx";
import {Navbar} from "./header/Navbar.jsx";
import App from "../App.jsx";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <App />
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-15 flex items-center px-4 border-b">
            <SidebarTrigger />
            <div className="ml-4 flex-1">
              <Navbar />
            </div>
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
