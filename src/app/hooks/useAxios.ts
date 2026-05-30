import axiosInstance from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const useAxios = () => {
  const { data: session } = useSession();

  useEffect(() => {
    // Add token to every request automatically
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (session?.user) {
          config.headers["x-user-id"] = session.user.id;
          config.headers["x-user-role"] = session.user.role;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Handle response errors globally
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Session expired or unauthorized
        if (error.response?.status === 401) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );

    // Cleanup interceptors when component unmounts
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [session]);

  return axiosInstance;
};

export default useAxios;
