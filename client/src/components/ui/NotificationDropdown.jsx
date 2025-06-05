import React, { useEffect, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import Skeleton from "../ui/SkeletonLoader.jsx";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar.jsx";

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="sm" className="p-2 relative">
          <Bell className="w-5 h-5" />
          {!loading && notifications.length > 0 && (
            <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-500 rounded-full" />
          )}
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        sideOffset={8}
        align="end"
        className="z-50 w-80 rounded-md bg-white dark:bg-gray-900 p-3 shadow-xl border dark:border-gray-700 "
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Notifications
        </h3>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-8 w-full rounded-md" />
            ))
          ) : notifications.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center p-2">
              You're all caught up!
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={n.avatarUrl} alt={n.name} />
                  <AvatarFallback>
                    {n.name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm text-gray-900 dark:text-white">
                  {n.message}
                </div>
              </div>
            ))
          )}
        </div>

        <DropdownMenu.Separator className="my-2 h-px bg-gray-200 dark:bg-gray-700" />

        <div className="text-center text-xs text-muted-foreground hover:underline cursor-pointer">
          View all notifications
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default NotificationsDropdown;
