import { useEffect, useState } from "react";
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from "@capacitor/push-notifications";

export function usePushNotifications() {
  const [token, setToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<PushNotificationSchema[]>([]);

  useEffect(() => {
    // 1. درخواست مجوز
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === "granted") {
        PushNotifications.register();
      } else {
        console.warn("Push notification permission not granted");
      }
    });

    // 2. وقتی توکن گرفتیم
    PushNotifications.addListener("registration", (token: Token) => {
      console.log("Device token:", token.value);
      setToken(token.value);
      alert(token)

      // 👇 اینجا می‌تونی توکن رو به سرورت بفرستی
      // fetch("/api/save-token", { method: "POST", body: JSON.stringify({ token: token.value }) })
    });

    // 3. خطای ثبت
    PushNotifications.addListener("registrationError", (error) => {
      console.error("Registration error:", error);
    });

    // 4. وقتی نوتیفیکیشن رسید (اپ بازه)
    PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
      console.log("Push received:", notification);
      setNotifications(prev => [...prev, notification]);
    });

    // 5. وقتی روی نوتیف کلیک شد
    PushNotifications.addListener("pushNotificationActionPerformed", (notification: ActionPerformed) => {
      console.log("Notification action performed:", notification.notification);
    });
  }, []);

  return { token, notifications };
}
