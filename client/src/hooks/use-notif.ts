// hooks/useNotifications.ts
import { useState, useEffect } from "react";
import NotificationApi from "@/api/notification";

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotificationIds, setUnreadNotificationIds] = useState<string[]>([]);
  const [isUnread, setIsUnread] = useState(false);

  // 🔹 Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await NotificationApi.checkNotification();
      if (response?.data?.new_notifications) {
        setIsUnread(true);
      }
      // If you want to also load notifications list:
      // const listResponse = await NotificationApi.getNotifications();
      // setNotifications(listResponse.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // 🔹 Mark a single notification as read
  const markAsRead = async (id: string) => {
    try {
      await NotificationApi.mark_read(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadNotificationIds((prev) => prev.filter((nid) => nid !== id));
      setIsUnread(unreadNotificationIds.length - 1 > 0);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // 🔹 Mark all as read
  const markAllAsRead = async () => {
    try {
      await Promise.all(unreadNotificationIds.map((id) => NotificationApi.mark_read(id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadNotificationIds([]);
      setIsUnread(false);
      NotificationApi.lastUsed = new Date();
      localStorage.setItem("lastNotif", JSON.stringify(new Date().getTime()));
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 120000); // 2 min polling
    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    setNotifications,
    isUnread,
    unreadNotificationIds,
    markAsRead,
    markAllAsRead,
  };
}
