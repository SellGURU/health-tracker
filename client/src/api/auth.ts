/* eslint-disable @typescript-eslint/no-explicit-any */
import Api from "./api";
interface AuthResponse {
  data: {
    access_token: string;
    permission: any;
    encoded_mi: string;
  };
}
class Auth extends Api {
  static login(username: string, password: string): Promise<AuthResponse> {
    const data = {
      email: username,
      password: password,
    };

    return this.post("/auth/mobile_token", data, {});
  }
  static signup(username: string, password: string) {
    const data = {
      email: username,
      password: password,
    };

    return this.post("/auth/mobile_register", data, {
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
