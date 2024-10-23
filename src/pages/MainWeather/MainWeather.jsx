import React, { useState, useEffect, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import Fab from '@mui/material/Fab';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid2';
import { getLatitudeLongitude, useGetCurrentWeather } from './api';
import { getDateTimeFromTimestamp } from '../../utils/string';
import { DarkModeContext } from '../../context/DarkModeContext';
import "./MainWeather.scss";
import { kelvinToCelsius } from '../../utils/conversion';
import useMediaQuery from '@mui/material/useMediaQuery';

const DEFAULT_LATITUDE = '1.290270'
const DEFAULT_LONGITUDE = '103.851959'

export default function MainWeather() {

    const { darkMode } = useContext(DarkModeContext)
    const isDesktop = useMediaQuery('(min-width:600px)');

    const [latitude, setLatitude] = useState(undefined);
    const [longitude, setLongitude] = useState(undefined);
    const [searchCity, setSearchCity] = useState('');
    const [searchCountry, setSearchCountry] = useState('')
    const [currentWeatherData, setCurrentWeatherData] = useState({})
    const [errorMessage, setErrorMessage] = useState('')
    const [history, setHistory] = useState([])

    const currentWeather = useGetCurrentWeather(latitude, longitude)
    
    useEffect(() => {
        // Obtain the default weather data to display
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
            });
        } else {
            // Default Latitude and Longitude to Singapore's
            setLatitude(DEFAULT_LATITUDE)
            setLongitude(DEFAULT_LONGITUDE)
        }
        // Obtain search history
        if (localStorage.getItem("search-history") !== null && Array.isArray(JSON.parse(localStorage.getItem("search-history")))) {
            setHistory(JSON.parse(localStorage.getItem("search-history")))
        } else {
            localStorage.setItem("search-history", JSON.stringify([]))
        }
    }, []);

    useEffect(() => {
        if (currentWeather.data?.weather) {
            setCurrentWeatherData({
                city: searchCity,
                country: currentWeather.data?.sys?.country,
                forecast: currentWeather.data?.weather[0].main,
                description: currentWeather.data?.weather[0].description,
                temperature: currentWeather.data?.main?.temp,
                minTemperature: currentWeather.data?.main?.temp_min,
                maxTemperature: currentWeather.data?.main?.temp_max,
                humidity: currentWeather.data?.main?.humidity,
                dateTime: Date.now()
            })

            if (searchCity && searchCountry) {
                if (localStorage.getItem("search-history") === null || !Array.isArray(JSON.parse(localStorage.getItem("search-history")))) {
                    const newHistory = [{
                        cityCountry: searchCity + ", " + searchCountry,
                        dateTime: Date.now()
                    }]
                    setHistory(newHistory)
                    localStorage.setItem("search-history", JSON.stringify(newHistory));
                } else {
                    var searchHistory = JSON.parse(localStorage.getItem("search-history"));
                    // Set a maximum of 20 past history searches
                    if (searchHistory.length === 20) {
                        searchHistory.pop()
                    }
                    searchHistory.unshift({
                        cityCountry: searchCity + ", " + searchCountry,
                        dateTime: Date.now()
                    })
                    localStorage.setItem("search-history", JSON.stringify(searchHistory));
                    setHistory(searchHistory)
                }
            }

        }
    }, [currentWeather.data]);

    const handleSearch = async () => {
        try {
            const data = await getLatitudeLongitude(searchCity, searchCountry)
            if(Array.isArray(data) && data.length > 0) {
                setLatitude(data[0].lat)
                setLongitude(data[0].lon)
            }
        } catch(error) {
            setErrorMessage(error.message)
        }
    }

    const handleHistorySearch = async (index) => {
        if (index < history.length) {
            try {
                const cityCountry = history[index].cityCountry.split(",")
                const data = await getLatitudeLongitude(cityCountry[0], cityCountry[1].trim())
                if(Array.isArray(data) && data.length > 0) {
                    setLatitude(data[0].lat)
                    setLongitude(data[0].lon)
                }
                setSearchCity(cityCountry[0])
                setSearchCountry(cityCountry[1].trim())
            } catch(error) {
                setErrorMessage(error.message)
            }
        }
    }

    const handleHistoryDelete = (index) => {
        if (index < history.length) {
            const newHistory = [...history]
            newHistory.splice(index, 1)
            setHistory(newHistory)
            localStorage.setItem("search-history", JSON.stringify(newHistory));
        }
    }

    return (
        <div className='weather-container'>
            <div className='weather-searchbar'>
                <TextField disabled={currentWeather.isFetching} className={`main-weather-search-bar ${darkMode ? 'main-weather-search-bar-dark' : 'main-weather-search-bar-light'}`} value={searchCity} onChange={(event) => {setSearchCity(event.target.value)}} id="city-input" label="City" variant="outlined" />
                <TextField disabled={currentWeather.isFetching} className={`main-weather-search-bar ${darkMode ? 'main-weather-search-bar-dark' : 'main-weather-search-bar-light'}`} value={searchCountry} onChange={(event) => {setSearchCountry(event.target.value)}} id="country-input" label="Country" variant="outlined" />
                <Button disabled={currentWeather.isFetching} className={`main-weather-search-btn ${darkMode ? 'main-weather-search-btn-dark' : 'main-weather-search-btn-light'}`} variant="contained" size="small" onClick={handleSearch} aria-label="search">
                    <SearchIcon />
                </Button>
            </div>
            {
                errorMessage && 
                <Alert id="weather-error-message" variant="filled" severity="error" onClose={() => {setErrorMessage('')}}>
                    {errorMessage}
                </Alert>
            }
            <div className={`weather-display ${darkMode ? 'weather-display-dark' : 'weather-display-light'}`}>
                <img id="sun-img" src="/sun.png" alt="sun-image" />
                {
                    isDesktop ? (
                        <>
                            <div id="weather-text">Today's Weather</div>
                            <div className={`weather-temperature ${darkMode ? 'weather-temperature-dark' : 'weather-temperature-light'}`}>{currentWeatherData?.temperature ? <>{kelvinToCelsius(currentWeatherData?.temperature)}°</> : <>--</>}</div>
                            <div id="weather-high-low-temperature">H: {kelvinToCelsius(currentWeatherData?.maxTemperature)}° L: {kelvinToCelsius(currentWeatherData?.minTemperature)}°</div>
                            <div className={`weather-additional-info ${darkMode ? 'weather-additional-info-dark' : 'weather-additional-info-light'}`}>
                                <span>{currentWeatherData?.city ? `${currentWeatherData.city}, ` : ``}{currentWeatherData?.country}</span>
                                <span>{getDateTimeFromTimestamp(currentWeatherData?.dateTime)}</span>
                                <span>Humidity: {currentWeatherData?.humidity}%</span>
                                <span>{currentWeatherData?.forecast}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <Grid container spacing={2}>
                                <Grid className="weather-additional-info-mobile-left" size={6}>
                                    <div id="weather-text">Today's Weather</div>
                                    <div className={`weather-temperature ${darkMode ? 'weather-temperature-dark' : 'weather-temperature-light'}`}>{currentWeatherData?.temperature ? <>{kelvinToCelsius(currentWeatherData?.temperature)}°</> : <>--</>}</div>
                                    <div id="weather-high-low-temperature">H: {kelvinToCelsius(currentWeatherData?.maxTemperature)}° L: {kelvinToCelsius(currentWeatherData?.minTemperature)}°</div>
                                    <span style={{ marginTop: '5px' }}>{currentWeatherData?.city ? `${currentWeatherData.city}, ` : ``}{currentWeatherData?.country}</span>
                                </Grid>
                                <Grid className={`weather-additional-info-mobile-right ${darkMode ? 'weather-additional-info-mobile-right-dark' : 'weather-additional-info-mobile-right-light'}`} size={6}>
                                    <span>{currentWeatherData?.forecast}</span>
                                    <span>Humidity: {currentWeatherData?.humidity}%</span>
                                    <span>{getDateTimeFromTimestamp(currentWeatherData?.dateTime)}</span>
                                </Grid>
                            </Grid>
                        </>
                    )
                }
                <div className={`weather-search-history ${darkMode ? 'weather-search-history-dark' : 'weather-search-history-light'}`}>
                    <div id="search-history-title">Search History</div>
                    {
                        history.map((item, index) => <SearchHistoryCard key={`search-history-item-${index}`} cityCountry={item.cityCountry} dateTime={item.dateTime} handleSearch={() => {handleHistorySearch(index)}} handleDelete={() => {handleHistoryDelete(index)}} />)
                    }
                </div>
            </div>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={currentWeather.isFetching}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}

const SearchHistoryCard = (props) => {

    const { darkMode } = useContext(DarkModeContext)
    const isDesktop = useMediaQuery('(min-width:600px)');

    if (isDesktop) {
        return (
            <div className={`search-history-card-container ${darkMode ? 'search-history-card-container-dark' : 'search-history-card-container-light'}`}>
                <span>{props.cityCountry}</span>
                <span>
                    {getDateTimeFromTimestamp(props.dateTime)}
                    &nbsp;
                    <Fab className='search-history-action-btn' size="small" onClick={props.handleSearch} color="default" aria-label="history-search">
                        <SearchIcon />
                    </Fab>
                    &nbsp;
                    <Fab className='search-history-action-btn' size="small" onClick={props.handleDelete} color="default" aria-label="history-delete">
                        <DeleteIcon />
                    </Fab>
                </span>
            </div>
        )
    } else {
        return (
            <div className={`search-history-card-container ${darkMode ? 'search-history-card-container-dark' : 'search-history-card-container-light'}`}>
                <span>
                    <div className='search-history-city-country-mobile'>{props.cityCountry}</div>
                    <div className='search-history-date-time-mobile'>{getDateTimeFromTimestamp(props.dateTime)}</div>
                </span>
                <span>
                    <Fab className='search-history-action-btn' size="small" onClick={props.handleSearch} color="default" aria-label="history-search">
                        <SearchIcon />
                    </Fab>
                    &nbsp;
                    <Fab className='search-history-action-btn' size="small" onClick={props.handleDelete} color="default" aria-label="history-delete">
                        <DeleteIcon />
                    </Fab>
                </span>
            </div>
        )
    }
}