import React, { useState } from 'react';
import { Search, Upload, Moon, Sun, Menu, Bell } from 'lucide-react';
import { useTheme } from '../ThemeProvider.jsx';
import { Button } from '../ui/Button.jsx';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar.jsx';
import { Modal } from '../ui/Modal.jsx';
import { Input } from '../ui/Input.jsx';

export const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    return (
        <>
            <nav className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95">
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
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">T</span>
                                </div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Tubbit</h1>
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
                            <Button variant="ghost" size="sm" onClick={toggleTheme} className="p-2">
                                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            </Button>

                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => setIsUploadModalOpen(true)}
                                className="hidden sm:flex"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                            </Button>

                            <Button variant="ghost" size="sm" className="p-2">
                                <Bell className="w-5 h-5" />
                            </Button>

                            <Avatar>
                                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" alt="User" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
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
            </nav>

            {/* Upload Modal */}
            <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upload Content</h2>
                    <div className="space-y-4">
                        <Button variant="default" className="w-full">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Video
                        </Button>
                        <Button variant="secondary" className="w-full">
                            Create Post
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};
