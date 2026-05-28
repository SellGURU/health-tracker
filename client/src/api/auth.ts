/* eslint-disable @typescript-eslint/no-explicit-any */
import Api from "./api";
interface AuthResponse {
  data: {
    access_token: string;
    permission: any;
    encoded_mi: string;
    refresh_token: string;
  };
}
interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date | null;
  address: string;
  phone: string;
  timeZone: string;
  photo: string;
}
class Auth extends Api {
  static login(username: string, password: string): Promise<AuthResponse> {
    const data = {
      email: username,
      password: password,
    };

    return this.post("/auth/mobile_token", data, {});
  }
  static signup(signupData: SignupData) {
    const data = {
      email: signupData.email,
      password: signupData.password,
      first_name: signupData.firstName,
      last_name: signupData.lastName,
      gender: signupData.gender,
      date_of_birth: signupData.dateOfBirth,
      address: signupData.address,
      phone_number: signupData.phone,
      timezone: signupData.timeZone,
      picture: signupData.photo,
    };

    return this.post("/auth/mobile_register", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  static refreshToken(): Promise<AuthResponse> {
    const data = {
      refresh_token: localStorage.getItem("refresh_token"),
    };

    return this.post("/auth/mobile_refresh", data, {});
  }

  static logOut() {
    return this.post("/auth/log_out");
  }
}

export default Auth;
