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
      email: username.trim(),
      password: password,
    };

    return this.post("/auth/mobile_token", data, {});
  }
  static signup(signupData: SignupData) {
    const formatDate = (date: Date | null): string | null => {
      if (!date) return null;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const data: Record<string, unknown> = {
      email: signupData.email.trim(),
      password: signupData.password,
      first_name: signupData.firstName.trim(),
      last_name: signupData.lastName.trim(),
      gender: signupData.gender,
      date_of_birth: formatDate(signupData.dateOfBirth),
      address: signupData.address?.trim() || "",
      phone_number: signupData.phone?.trim() || "",
      timezone: signupData.timeZone || "",
    };

    // Only include picture when the user actually selected one (avoid huge/empty quirks)
    if (signupData.photo) {
      data.picture = signupData.photo;
    }

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
