import React, { useState } from "react";
import {
  Search,
  Upload,
  Moon,
  Sun,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "../ThemeProvider.jsx";
import { Button } from "../ui/Button.jsx";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar.jsx";
import { Input } from "../ui/Input.jsx";
import UploadModal from "../UploadModal.jsx";
import NotificationsDropdown from "../ui/NotificationDropdown.jsx";
import lightLogo from "../../assets/Tubbit_Logo_final_light.png";
import darkLogo from "../../assets/Tubbit_Logo_final_dark2.png";
import { signOut } from "../../services/user/auth.api.js";
import { logout as storeLogOut } from "../../store/slices/AuthSlice.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropDownMenu.jsx";
import { SidebarTrigger } from "../ui/Sidebar.jsx";

export const Navbar = () => {
  const [query, setQuery] = useState("");
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const logOutDispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const authUserData = useSelector((state) => state.auth.userData);
  const user = authUserData || {};

  const logo = theme === "dark" ? darkLogo : lightLogo;

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setIsMobileSearchOpen(false);
    }
  };

  const handleAuthClick = () => navigate("/auth");

  const handleProfileClick = () => {
    navigate(`/profile/${user?.data?.username}`);
  };

  const handleLogout = async () => {
    const response = await signOut();
    if (response.status === 200) {
      logOutDispatch(storeLogOut());
      setIsUploadModalOpen(false);
      navigate("/");
    }
  };

  const handleUploadClick = () => {
    if (!authStatus) {
      navigate("/auth");
      return;
    }
    setIsUploadModalOpen(true);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left section: SidebarTrigger + Logo */}
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="ml-0" />
              <div
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <img
                  src={logo}
                  alt="Tubbit Logo"
                  className="h-16 w-16 object-contain"
                />
              </div>
            </div>

            {/* Middle section: Search Bar */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-xl mx-8"
            >
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search videos"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
              </div>
            </form>

            {/* Right section */}
            <div className="flex items-center space-x-3">
              {!isMobileSearchOpen ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMobileSearchOpen(true)}
                >
                  <Search className="w-5 h-5" />
                </Button>
              ) : (
                <form
                  onSubmit={handleSearch}
                  className="flex items-center space-x-2 w-full max-w-[300px]"
                >
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      autoFocus
                      placeholder="Search..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setIsMobileSearchOpen(false)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      ✕
                    </button>
                  </div>
                </form>
              )}

              {/* Auth Section */}
              {authStatus ? (
                <DropdownMenu>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleUploadClick}
                    className="hidden sm:flex"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  <NotificationsDropdown />

                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.data?.avatar}
                          alt={user?.data?.fullname}
                        />
                        <AvatarFallback>
                          {user?.data?.fullname?.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-popover border border-border shadow-lg"
                    align="end"
                    forceMount
                  >
                    <div className="flex items-center gap-2 p-2">
                      <div className="flex flex-col leading-none">
                        <p className="font-medium">{user?.data?.fullname}</p>
                        <p className="text-xs text-muted-foreground">
                          {user?.data?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleProfileClick}>
                      <User className="mr-2 h-4 w-4" />
                      Go to Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={toggleTheme}>
                      {theme === "light" ? (
                        <>
                          <Moon className="mr-2 h-4 w-4" />
                          Dark Mode
                        </>
                      ) : (
                        <>
                          <Sun className="mr-2 h-4 w-4" />
                          Light Mode
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={handleAuthClick}>
                    Sign In
                  </Button>
                  <Button size="sm" onClick={handleAuthClick}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </>
  );
};
