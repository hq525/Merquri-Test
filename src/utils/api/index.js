import instance from "./api"
import { responseInterceptor } from "./interceptors";

instance.interceptors.response.use(responseInterceptor, error => {
        if (error.response?.status === 401) {
            window.location.reload()
        }

        return Promise.reject(error);
    }
)

export default axiosInstance;