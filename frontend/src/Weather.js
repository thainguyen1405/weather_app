import {useState} from 'react';
import './Weather.css';
import './weather-icons-master/css/weather-icons.css';

function Weather() {
    // Create state variables for each weather property
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);

    //Handle input changes for latitude and longitude
    function latInputChange(event){
        const value = event.target.value;
        setLat(value);
    }

    function lonInputChange(event){
        const value = event.target.value;
        setLon(value);
    }
    
    // Function to get weather icon based on conditions
    const getWeatherIcon = (temp, humidity, cloudPct, windSpeed) => {
        const hour = new Date().getHours();
        const isDay = hour >= 6 && hour < 18;
        
        // Determine weather condition based on API data
        if (cloudPct > 80) {
            if (humidity > 80) {
                return isDay ? 'wi-day-rain' : 'wi-night-alt-rain';
            }
            return isDay ? 'wi-day-cloudy' : 'wi-night-alt-cloudy';
        } else if (cloudPct > 50) {
            return isDay ? 'wi-day-cloudy' : 'wi-night-alt-cloudy';
        } else if (cloudPct > 20) {
            return isDay ? 'wi-day-sunny-overcast' : 'wi-night-partly-cloudy';
        } else {
            if (windSpeed > 10) {
                return isDay ? 'wi-day-windy' : 'wi-night-alt-cloudy-windy';
            }
            return isDay ? 'wi-day-sunny' : 'wi-night-clear';
        }
    };
    
    // Function to set coordinates for famous cities
    const selectCity = (latitude, longitude, cityName) => {
        setLat(latitude);
        setLon(longitude);
    };
    
    // Famous cities data
    const famousCities = [
        { name: "New York", lat: "40.7128", lon: "-74.0060" },
        { name: "London", lat: "51.5074", lon: "-0.1278" },
        { name: "Tokyo", lat: "35.6762", lon: "139.6503" },
        { name: "Paris", lat: "48.8566", lon: "2.3522" },
        { name: "Sydney", lat: "-33.8688", lon: "151.2093" },
        { name: "Dubai", lat: "25.2048", lon: "55.2708" },
        { name: "Singapore", lat: "1.3521", lon: "103.8198" },
        { name: "Los Angeles", lat: "34.0522", lon: "-118.2437" }
    ];
    
    // Function to fetch weather data from backend
    const fetchWeather = () => {
    setLoading(true);
        
        // Check if user has entered coordinates manually
        if (lat && lon) {
            // Use manually entered coordinates
            fetch(`http://localhost:8000/weather?lat=${lat}&lon=${lon}`) //Fetch data from backend
                .then((response) => response.json())
                .then((data) => {
                    setWeatherData(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching weather data:', error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
            alert('Please enter both latitude and longitude.');
        }
    };
    
    return(
        <div className = "background">
            <h1 className = "heading">SkyView</h1>
            <div className = "main-container">
                {/*Left Section: Input Fields and City Selection*/}
                <div className = "left-side">
                    <input className = "lat-input"
                        type = 'text'
                        placeholder = 'Enter Latitude'
                        value = {lat}
                        onChange = {latInputChange}
                    />
                    <input className = "lon-input"
                        type = 'text'
                        placeholder = 'Enter Longitude'
                        value = {lon}
                        onChange = {lonInputChange}
                    />
                    <button className = "button" onClick={fetchWeather}>
                        {loading ? 'Loading...' : 'Get Weather'}
                    </button>
                </div>

                {/*Middle Section: Famous Cities*/}
                <div className = "cities-section">
                    <h3 className = "cities-title">Quick Select Cities</h3>
                    <div className = "cities-grid">
                        {famousCities.map((city, index) => (
                            <div 
                                key={index} 
                                className = "city-card"
                                onClick={() => selectCity(city.lat, city.lon, city.name)}  // Set coordinates on click
                            >
                                <div className = "city-name">{city.name}</div>
                                <div className = "city-coords">{city.lat}, {city.lon}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/*Right Section: Weather Information*/}
                <div className = "right-side">
                    {weatherData ? (
                        <div className = "weather-info">
                            <div className = "weather-header">
                                <i className={`wi ${getWeatherIcon(weatherData.temp, weatherData.humidity, weatherData.cloud_pct, weatherData.wind_speed)} weather-icon`}></i>
                                <h2>Weather Properties</h2>
                            </div>
                            <p>Temperature: {weatherData.temp}°C</p>
                            <p>Humidity: {weatherData.humidity}%</p>
                            <p>Wind Speed: {weatherData.wind_speed} m/s</p>
                            <p>Wind Direction: {weatherData.wind_degrees}°</p>
                            <p>Cloud Percentage: {weatherData.cloud_pct}%</p>
                            <p>Feels Like: {weatherData.feels_like}°C</p>
                            <p>Min Temperature: {weatherData.min_temp}°C</p>
                            <p>Max Temperature: {weatherData.max_temp}°C</p>
                            <p>Sunrise: {new Date(weatherData.sunrise * 1000).toLocaleTimeString()}</p>
                            <p>Sunset: {new Date(weatherData.sunset * 1000).toLocaleTimeString()}</p>
                        </div>
                    ) : (
                        <div style={{textAlign: 'center', color: '#888'}}>
                            <p>Enter latitude and longitude to get weather information</p>
                        </div>
                    )}
                </div>
                
                {/*Social Media Icons*/}
                <div className = "social-icons">
                    <a href = "https://github.com/thainguyen1405"
                        target="_blank"
                        rel="noopener noreferrer">
                        <ion-icon name="logo-github"></ion-icon>
                    </a>

                    <a href = "https://www.linkedin.com/in/thainguyen1405/"
                        target="_blank"
                        rel="noopener noreferrer">
                        <ion-icon name="logo-linkedin"></ion-icon>
                    </a>
                </div>
            </div>
        </div>
    )
}


export default Weather;