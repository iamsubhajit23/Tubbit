import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, MessageCircle, History, ThumbsUp, List } from "lucide-react";
import { useSelector } from "react-redux";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../components/ui/Avatar.jsx";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "./ui/Sidebar.jsx";
import { getSubscribedChannel } from "../services/subscription/subscription.api.js";

const AppSidebar = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const channels = useSelector((state) => state.subscription.subscribedChannels);

  useEffect(() => {
    const fetchSubscribedChannels = async () => {
      const res = await getSubscribedChannel();
      if (res.statuscode === 200) {
        setSubscribedChannels(res.data?.subscribedChannel);
      }
    };
    fetchSubscribedChannels();
  }, [channels, authStatus]);

  const mainItems = [
    { title: "Home", url: "/", icon: Home },
    { title: "Tweets", url: "/tweets", icon: MessageCircle },
  ];

  const authItems = [
    { title: "Watch History", url: "/watch-history", icon: History },
    { title: "Liked Videos", url: "/liked-videos", icon: ThumbsUp },
    { title: "Playlists", url: "/playlists", icon: List },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        {/* First Section */}
        <SidebarGroup className="mt-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Second Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {authItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={authStatus ? item.url : "/auth"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Third Section */}
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {subscribedChannels.map((data) => (
                <SidebarMenuItem key={data._id}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={
                        authStatus
                          ? `/profile/${data?.channel?.username}`
                          : "/auth"
                      }
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground"
                    >
                      <div className="relative">
                        <Avatar className="w-6 h-6">
                          <AvatarImage
                            src={data?.channel?.avatar}
                            alt={data?.channel?.fullname?.charAt(0)}
                          />
                          <AvatarFallback className="text-xs">
                            {data?.channel?.fullname?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {data?.isLive && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background"></div>
                        )}
                      </div>
                      {!isCollapsed && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {data?.channel?.fullname}
                          </span>
                          {data?.isLive && (
                            <span className="text-xs text-red-500 font-medium">
                              LIVE
                            </span>
                          )}
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
