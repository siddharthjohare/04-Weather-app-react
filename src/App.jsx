import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  //1- Retrieve city from LocalStorage, otherwise default to "Delhi".
  const [city, setCity] = useState(
    localStorage.getItem("savedCity") || "Delhi",
  );
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);

  // API Call function
  const getWeather = async (searchCity = city) => {
    // Basic validation: Show an error message if the input field is empty.
    if (searchCity.trim() === "") {
      setError("Please Enter City Name");
      return;
    }
    try {
      setLoading(true);
      setError("");
      // Fetching data from API
      const res = await fetch(`https://wttr.in/${searchCity}?format=j1`);
      const data = await res.json();
      setWeather(data);

      // 2- Save the city in LocalStorage to improve the user experience.
      localStorage.setItem("savedCity", searchCity);

      setLoading(false);
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  // 3- Fetch weather data for the saved city when the component/page loads
  useEffect(() => {
    getWeather(city);
  }, []);

  const handleChange = (e) => {
    setCity(e.target.value);
    // Clear the error message when the user starts typing.
    setError("");
  };

  const handleReset = () => {
    setCity("");
    setWeather(null);
    setError("");
    localStorage.removeItem("savedCity");
    // 4- Clear all data from LocalStorage.
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      getWeather();
    }
  };

  return (
    <div className={dark ? "container dark" : "container"}>
      <div className="weather-box">
        <div className="top-bar">
          <h1>🌤 Weather App</h1>
          <button onClick={() => setDark(!dark)}>
            {dark ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter City Name..."
            value={city}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button onClick={() => getWeather()}>Search</button>
          <button onClick={handleReset}>Reset</button>
        </div>

        {/* CSS typo fixed: 'greena' -> 'green' */}
        {loading && (
          <h3 style={{ color: "green", textAlign: "center" }}>Loading...</h3>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {weather && !loading && (
          <>
            <div className="weather-info">
              <h2>{city}</h2>
              <h1>{weather.current_condition[0].temp_C}°C</h1>
              <p>{weather.current_condition[0].weatherDesc[0].value}</p>
              <p>Humidity: {weather.current_condition[0].humidity}%</p>
            </div>

            <div className="forecast">
              <h3>Day Forecast</h3>
              {weather.weather.map((day, i) => (
                <div key={i} className="day-card">
                  <span>Day {i + 1}</span>
                  <span>{day.avgtempC}°C</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
