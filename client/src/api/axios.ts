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
      error.response?.status == 401) {
      localStorage.clear();
      // window.location.reload();
    }

    return Promise.reject(error);
  }
);
