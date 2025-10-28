import axios from "axios";
// import { useToast } from "@/hooks/use-toast";

// const { toast } = useToast();

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // console.log(error);
    if (
      error.response?.status == 401 ) {
      localStorage.clear();
      // Avoid full reload on mobile WebView; navigate to auth route instead
      window.location.href = "/auth";
    }

    return Promise.reject(error);
  }
);
