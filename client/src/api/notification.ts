import Api from "./api";

class NotificationApi extends Api {
    static registerToken = (token:string) => {
        return this.post("/notif/token", {
            fcm_token: token,
        });
    }
}

export default NotificationApi;