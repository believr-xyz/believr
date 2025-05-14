"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/hooks/use-notifications";
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

export default function NotificationsPage() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } =
    useNotifications();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");

  const getNotificationIcon = (type: string) => {
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

  const handleNotificationClick = async (notification: any) => {
    // Mark as read
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.type === "FOLLOW" && notification.data.profileUsername) {
      router.push(`/u/${notification.data.profileUsername}`);
    } else if (notification.data.postId && notification.data.profileUsername) {
      router.push(
        `/posts/${notification.data.profileUsername}/${notification.data.postId}`
      );
    }
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab.toUpperCase();
  });

  return (
    <div className="container mx-auto max-w-4xl pb-12">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-3xl">Notifications</h1>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => markAllAsRead()}
            >
              <CheckCheck className="size-4" />
              Mark all as read
            </Button>
          )}
        </div>
        <p className="mt-2 text-muted-foreground">
          Stay updated with your latest interactions
        </p>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6 grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </TabsTrigger>
          <TabsTrigger value="follow">Follows</TabsTrigger>
          <TabsTrigger value="comment">Comments</TabsTrigger>
          <TabsTrigger value="collect">Collects</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {isLoading ? (
            <Card>
              <CardContent className="flex h-[300px] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex h-[300px] flex-col items-center justify-center gap-4 py-10 text-center">
                <Bell className="size-12 text-muted-foreground/50" />
                <div>
                  <h3 className="font-medium text-lg">No notifications</h3>
                  <p className="text-muted-foreground">
                    You don't have any{" "}
                    {activeTab !== "all"
                      ? activeTab === "unread"
                        ? "unread notifications"
                        : `${activeTab} notifications`
                      : "notifications yet"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    !notification.read ? "border-l-4 border-l-[#00A8FF]" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Avatar className="size-10">
                          {notification.data.profileImage ? (
                            <AvatarImage
                              src={notification.data.profileImage}
                              alt="Profile"
                            />
                          ) : (
                            <AvatarFallback>
                              {notification.data.profileName?.[0] || "U"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">
                              {notification.data.profileName || "User"}
                            </div>
                            <p className="text-muted-foreground text-sm">
                              @{notification.data.profileHandle || "user"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <span className="flex items-center gap-1">
                              {getNotificationIcon(notification.type)}
                              {notification.type.charAt(0) +
                                notification.type.slice(1).toLowerCase()}
                            </span>
                            <span>•</span>
                            <span>
                              {formatDistanceToNow(notification.createdAt, {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>
                        <p className="mt-2">{notification.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
