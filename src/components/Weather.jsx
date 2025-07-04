import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import searchIcon from '../assets/search.png';
import clear from '../assets/clear.png';
import cloud from '../assets/cloud.png';
import drizzle from '../assets/drizzle.png';
import humidity from '../assets/humidity.png';
import rain from '../assets/rain.png';
import snow from '../assets/snow.png';
import wind from '../assets/wind.png';

const Weather = () => {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const allIcons = {
        "01d": clear,
        "01n": clear,
        "02d": cloud,
        "02n": cloud,
        "03d": cloud,
        "03n": cloud,
        "04d": drizzle,
        "04n": drizzle,
        "09d": rain,
        "09n": rain,
        "10d": rain,
        "10n": rain,
        "13d": snow,
        "13n": snow
    };

    const fetchWeather = async (city) => {
        if (city === "") {
            alert("Enter the city name");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                setWeatherData(null);
                setError(data.message);
                return;
            }

            const icon = allIcons[data?.weather?.[0]?.icon] || clear;

            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon
            });
        } catch (error) {
            console.error("Error fetching weather:", error);
            setWeatherData(null);
            setError("Failed to fetch weather data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather("London");
    }, []);

    return (
        <div className='weather'>
            <div className="search-bar">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder='Search city...'
                    onKeyDown={(e) => e.key === 'Enter' && fetchWeather(inputRef.current.value)}
                />
                <img
                    src={searchIcon}
                    alt="search"
                    onClick={() => {
                        fetchWeather(inputRef.current.value);
                        inputRef.current.value = "";
                    }}
                />
            </div>

            {loading ? (
                <p className='message'>Loading weather...</p>
            ) : error ? (
                <p className='message error'>{error}</p>
            ) : weatherData ? (
                <>
                    <img src={weatherData.icon} alt="Weather Icon" className='weather-icon' />
                    <p className='temperature'>{weatherData.temperature}°C</p>
                    <p className='location'>{weatherData.location}</p>
                    <div className='weather-data'>
                        <div className="col">
                            <img src={humidity} alt="Humidity" />
                            <div>
                                <p>{weatherData.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className="col">
                            <img src={wind} alt="Wind Speed" />
                            <div>
                                <p>{weatherData.windSpeed} km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <p className='message'>No weather data available.</p>
            )}
        </div>
    );
};

export default Weather;
