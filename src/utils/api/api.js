import axios from "axios";
import pRetry from "p-retry";

const MAX_RETRIES = 2;

export const instance = axios.create({
    baseURL: "",
    timeout: 15000,
    headers: { "Content-Type": "application/json;charset=utf-8" }
});

export const executeAxiosRequest = async (
    axiosInstance,
    action,
    url,
    config
) => {
    const response = await axiosInstance[action.toLowerCase()](url, config);

    return response;
};
  
const getWithRetries = (
    url,
    config,
    axiosInstance = instance
  ) =>
    pRetry(() => executeAxiosRequest(axiosInstance, "get", url, config), {
      retries: MAX_RETRIES,
      onFailedAttempt: (error) => {
        if (error.retriesLeft === 0) {
          // eslint-disable-next-line no-console
          console.error(
            error.attemptNumber,
            "Unable to fetch!"
          );
        }
      },
    });
  
const postWithRetries = (
    url,
    config,
    axiosInstance = instance
    ) =>
    pRetry(() => executeAxiosRequest(axiosInstance, "post", url, config), {
        retries: MAX_RETRIES,
        onFailedAttempt: (error) => {
        if (error.retriesLeft === 0) {
            // eslint-disable-next-line no-console
            console.error(
                error.attemptNumber,
                "Unable to POST!"
            );
        }
        },
    });

instance.getWithRetries = getWithRetries;
instance.postWithRetries = postWithRetries;

export default instance;
  