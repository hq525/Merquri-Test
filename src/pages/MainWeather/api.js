import { useQuery } from "@tanstack/react-query";
import { capitalizeFirstLetter } from "../../utils/string";
import { instance } from "../../utils/api/api"

const getCurrentWeather = async (latitude, longitude) => {
    try {
        const response = await instance.get(`${process.env.REACT_APP_OPEN_WEATHER_API_ENDPOINT}/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`);
        
        return response.data
    } catch(error) {
        const message = error?.response?.data?.message || 'Something went wrong, please try again later.';
        throw new Error(capitalizeFirstLetter(message));
    }
}

export const useGetCurrentWeather = (latitude, longitude) => useQuery({
    queryKey: ['getCurrentWeather', latitude, longitude],
    queryFn: () => {
        if (latitude && longitude) {
            return getCurrentWeather(latitude, longitude)
        }
        return {}
    }
})

export const getLatitudeLongitude = async (city, country) => {
    try {
        const response = await instance.get(`${process.env.REACT_APP_OPEN_WEATHER_API_ENDPOINT}/geo/1.0/direct?q=${city}, ${country}&limit=5&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`);
        
        return response.data
    } catch(error) {
        const message = error?.response?.data?.message || 'Something went wrong, please try again later.';
        throw new Error(capitalizeFirstLetter(message));
    }
}