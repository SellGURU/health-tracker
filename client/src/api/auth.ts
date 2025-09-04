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
      username: username,
      password: password,
    };

    return this.post("/auth/token", data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
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

    return this.post("/auth/", data, {
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
