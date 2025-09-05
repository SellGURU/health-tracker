/* eslint-disable @typescript-eslint/no-explicit-any */
import Api from "./api";
interface AuthResponse {
  data: {
    access_token: string;
    permission: any;
  };
}
class Auth extends Api {
  static login(username: string, password: string): Promise<AuthResponse> {
    const data = {
      email: username,
      password: password,
    };

    return this.post("/auth/mobile_token", data, {

    });
  }
  static signup(
    username?: string,
    email?: string,
    password?: string,
    google_json?: any
  ) {
    const data = {
      user_name: username,
      user_mail: email,
      password: password,
      google_json: google_json,
    };

    return this.post("/auth/mobile_token", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static logOut() {
    return this.post("/auth/log_out");
  }
}

export default Auth;
