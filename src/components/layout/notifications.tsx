"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Notification, NotificationType, useNotifications } from "@/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";
import {
  AtSign,
  Bell,
  CheckCheck,
  Heart,
  Loader2,
  MessageCircle,
  Quote,
  Repeat,
  User,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Notifications() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "FOLLOW":
        return <User className="size-4 text-blue-500" />;
      case "COMMENT":
        return <MessageCircle className="size-4 text-green-500" />;
      case "COLLECT":
        return <Wallet className="size-4 text-purple-500" />;
      case "MENTION":
        return <AtSign className="size-4 text-yellow-500" />;
      case "REACTION":
        return <Heart className="size-4 text-red-500" />;
      case "MIRROR":
        return <Repeat className="size-4 text-cyan-500" />;
      case "QUOTE":
        return <Quote className="size-4 text-orange-500" />;
      default:
        return <Bell className="size-4" />;
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.type === "FOLLOW" && notification.data.profileHandle) {
      router.push(`/u/${notification.data.profileHandle}`);
    } else if (notification.data.postId && notification.data.profileHandle) {
      router.push(`/p/${notification.data.profileHandle}/${notification.data.postId}`);
    }

    // Close popover
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <Badge
              className="-right-1 -top-1 absolute flex size-4 items-center justify-center rounded-full bg-[#00A8FF] p-0 text-white"
              variant="outline"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 pb-2">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={() => markAllAsRead()}
            >
              <CheckCheck className="size-3" />
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex h-[300px] items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex h-[300px] flex-col items-center justify-center gap-2 text-center">
              <Bell className="size-10 text-muted-foreground/50" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`cursor-pointer p-4 transition-colors hover:bg-accent/50 ${
                    !notification.read ? "bg-accent/30" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <Avatar className="size-8">
                        {notification.data.profileImage ? (
                          <AvatarImage src={notification.data.profileImage} alt="Profile" />
                        ) : (
                          <AvatarFallback>
                            {notification.data.profileName?.[0] || "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">
                          {notification.data.profileName || "User"}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                          {getNotificationIcon(notification.type)}
                          {formatDistanceToNow(notification.createdAt, {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                      <p className="text-sm">{notification.message}</p>
                      {!notification.read && (
                        <div className="mt-1 flex justify-end">
                          <div className="size-2 rounded-full bg-[#00A8FF]" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
