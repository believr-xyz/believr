"use client";

import { getLensClient } from "@/lib/lens/client";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { useCallback, useEffect, useState } from "react";

// Define notification types in line with Lens Protocol
export type NotificationType =
  | "FOLLOW"
  | "COMMENT"
  | "MIRROR"
  | "QUOTE"
  | "MENTION"
  | "REACTION"
  | "COLLECT";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: Date;
  data: {
    profileId?: string;
    profileHandle?: string;
    profileName?: string;
    profileImage?: string;
    postId?: string;
  };
}

interface UseNotificationsOptions {
  limit?: number;
  pollingInterval?: number; // in milliseconds
}

interface UseNotificationsResult {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useNotifications({
  limit = 20,
  pollingInterval = 30000, // 30 seconds
}: UseNotificationsOptions = {}): UseNotificationsResult {
  const { data: user } = useAuthenticatedUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const client = await getLensClient();

      // For MVP, we're using mock data
      // In production, we would use the Lens Protocol notification API:
      // const result = await fetchNotifications(client, { limit });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Generate mock notifications
      const mockNotifications: Notification[] = [];
      const notificationTypes: Array<NotificationType> = [
        "FOLLOW",
        "COMMENT",
        "MIRROR",
        "QUOTE",
        "MENTION",
        "REACTION",
        "COLLECT",
      ];

      // Helper to generate a realistic message based on notification type
      const generateMessage = (type: NotificationType, name: string): string => {
        switch (type) {
          case "FOLLOW":
            return `${name} started following you`;
          case "COMMENT":
            return `${name} commented on your post`;
          case "MIRROR":
            return `${name} mirrored your post`;
          case "QUOTE":
            return `${name} quoted your post`;
          case "MENTION":
            return `${name} mentioned you in a post`;
          case "REACTION":
            return `${name} reacted to your post`;
          case "COLLECT":
            return `${name} collected your post`;
          default:
            return `${name} interacted with your content`;
        }
      };

      // Generate random mock notifications
      for (let i = 0; i < Math.min(limit, 5 + Math.floor(Math.random() * 10)); i++) {
        const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        const profileName = `User ${Math.floor(Math.random() * 1000)}`;
        const profileHandle = `user${Math.floor(Math.random() * 1000)}`;

        mockNotifications.push({
          id: `notification-${Date.now()}-${i}`,
          type,
          message: generateMessage(type, profileName),
          read: Math.random() > 0.3, // 30% chance of being unread
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)), // Random date within last week
          data: {
            profileId: `0x${Math.random().toString(16).substring(2, 10)}`,
            profileHandle,
            profileName,
            postId:
              type !== "FOLLOW" ? `0x${Math.random().toString(16).substring(2, 10)}` : undefined,
          },
        });
      }

      // Sort by date (newest first)
      mockNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setNotifications(mockNotifications);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch notifications"));
    } finally {
      setIsLoading(false);
    }
  }, [user, limit]);

  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      // In production, we would call the Lens API:
      // const client = await getLensClient();
      // const result = await updateNotificationAsRead(client, { id: notificationId });

      // For MVP, just update the local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification,
        ),
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user) return;

    try {
      // In production, we would call the Lens API:
      // const client = await getLensClient();
      // const result = await updateAllNotificationsAsRead(client);

      // For MVP, just update the local state
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  // Set up polling
  useEffect(() => {
    if (user) {
      fetchNotifications();

      const intervalId = setInterval(fetchNotifications, pollingInterval);

      return () => clearInterval(intervalId);
    }
  }, [user, fetchNotifications, pollingInterval]);

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
}
