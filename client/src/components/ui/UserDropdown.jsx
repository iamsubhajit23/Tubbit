import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut, User, Settings } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar.jsx";

const UserDropdown = () => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <Avatar className="cursor-pointer">
                    <AvatarImage
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
                        alt="User"
                    />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content
                sideOffset={8}
                className="z-50 min-w-[180px] rounded-md bg-white dark:bg-gray-800 p-2 shadow-lg border dark:border-gray-700"
            >
                <DropdownMenu.Item className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <User className="w-4 h-4" /> Profile
                </DropdownMenu.Item>
                <DropdownMenu.Item className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Settings className="w-4 h-4" /> Settings
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 border-t dark:border-gray-700" />
                <DropdownMenu.Item className="flex items-center gap-2 p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-800 text-red-600 dark:text-red-400">
                    <LogOut className="w-4 h-4" /> Logout
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

export default UserDropdown;
