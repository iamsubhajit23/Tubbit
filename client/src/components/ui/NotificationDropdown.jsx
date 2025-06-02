import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell } from "lucide-react";
import { Button } from "../ui/Button.jsx";

const NotificationsDropdown = () => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                    <Bell className="w-5 h-5" />
                </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content
                sideOffset={8}
                className="z-50 w-80 rounded-md bg-white dark:bg-gray-800 p-3 shadow-xl border dark:border-gray-700"
            >
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Notifications
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    <div className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                        New comment on your video.
                    </div>
                    <div className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                        Your post got 5 new likes.
                    </div>
                    {/* Add more dummy or dynamic notifications */}
                </div>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

export default NotificationsDropdown;
