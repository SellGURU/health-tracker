/* eslint-disable @typescript-eslint/no-explicit-any */
import Api from "./api";

class NotificationApi extends Api {
  static lastUsed: Date | null = null;
  static isChecking: boolean = false;

  static registerToken(token: string) {
    return this.post("/notif/token", {
      fcm_token: token,
    });
  }

  static check_notif(data: any) {
    return this.post("mobile/check_new", data);
  }

  static getNotification() {
    return this.get("/mobile/notifications", );
  }

  static mark_read(data: any) {
    return this.post("/mobile/mark_read", data);
  }

  static send_notif(data: any) {
    return this.post("/mobile/send", data);
  }

  // --- Brought from Web ---
  static readNotification(notification_id: string) {
    return this.post(
      "/mobile/mark_read",
      { notification_id },
      { noPending: true }
    );
  }

  static checkNotification() {
    if (this.isChecking) {
      console.warn(
        "Notification.checkNotification: A check is already in progress. Skipping."
      );
      return Promise.resolve({
        data: {
          new_notifications: false,
          checked_after: String(new Date().getTime()),
        },
      });
    }

    if (this.lastUsed == null) {
      const last = localStorage.getItem("lastNotif");
      if (last) {
        try {
          const storedTimestamp = JSON.parse(last);
          if (typeof storedTimestamp === "number") {
            this.lastUsed = new Date(storedTimestamp);
          } else {
            this.lastUsed = new Date(0);
          }
        } catch (e) {
          console.error("Failed to parse lastNotif from localStorage:", e);
          this.lastUsed = new Date(0);
        }
      }
    }

    const timeToSend = this.lastUsed
      ? String(this.lastUsed.getTime())
      : String(new Date(0).getTime());

    this.isChecking = true;

    return this.post(
      "/mobile/check_new",
      { time: timeToSend },
      { noPending: true }
    ).finally(() => {
      try {
        // Always advance last check time to "now" regardless of response
        const now = Date.now();
        this.lastUsed = new Date(now);
        localStorage.setItem("lastNotif", JSON.stringify(now));
      } catch (err) {
        console.error("Failed to persist lastNotif after check:", err);
      }
      this.isChecking = false;
    });
  }
}

export default NotificationApi;
