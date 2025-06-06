import React, { useState } from "react";
import { Search, Upload, Moon, Sun, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "../ThemeProvider.jsx";
import { Button } from "../ui/Button.jsx";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar.jsx";
import { Input } from "../ui/Input.jsx";
import UploadModal from "../UploadModal.jsx";
import NotificationsDropdown from "../ui/NotificationDropdown.jsx";
import lightLogo from "../../assets/Tubbit_Logo_final_light.png";
import darkLogo from "../../assets/Tubbit_Logo_final_dark2.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropDownMenu.jsx";

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const authUser = useSelector((state) => state.auth.userData);
  const user = authUser || {};
  const logout = useSelector((state) => state.auth.logout);

  // Determine which logo to use based on the theme
  const logo = theme == "dark" ? darkLogo : lightLogo;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleAuthClick = () => {
    navigate("/auth");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsUploadModalOpen(false);
    navigate("/");
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
      <nav className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b dark:bg-transparent border-gray-200 dark:border-gray-700 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Mobile Menu Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <img
                  src={logo}
                  alt="Tubbit Logo"
                  className="h-16 w-16 object-contain"
                />
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search videos, users..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </Button>

              {/* authentication */}
              {authStatus ? (
                // User Menu (when logged in)
                <DropdownMenu>
                  <Button
                    variant="default"
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
                        <AvatarImage src= "https://github.com/shadcn.png" alt={user?.name} />
                        <AvatarFallback>
                          {user?.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-popover border border-border shadow-lg"
                    align="end"
                    forceMount
                  >
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleProfileClick}>
                      {/* <User className="mr-2 h-4 w-4" /> */}
                      Go to Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {/* <Settings className="mr-2 h-4 w-4" /> */}
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      {/* <LogOut className="mr-2 h-4 w-4" /> */}
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Sign In/Sign Up buttons (when not logged in)
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

        {/* Mobile Search Bar */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search videos, users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
        />
      </nav>
    </>
  );
};
