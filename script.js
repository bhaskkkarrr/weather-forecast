const apiKey = "8d762746f485c9568b72b1c62d9589e4";
const forecastApiKey = "91b8db2a8e08486e868134037250408";
const lightBtn = document.querySelector("#light");
const lightModeBg = document.querySelectorAll(".light-theme-bg");
const lightModeText = document.querySelectorAll(".light-theme-text");
const lightIcon = document.querySelectorAll(".light-theme-icon");
const darkThemebody = document.querySelector("body");
const darkThemeleft = document.querySelector(".left-section");
const celSelect = document.querySelector("#cel");
const fehSelect = document.querySelector("#feh");
const allTemperatures = document.querySelectorAll(".celsius");
const searchBar = document.querySelector("#search-text");
const weekDays = document.querySelectorAll(".days-name");
const DEFAULT_CITY = "Delhi";

// Get Day and  Date
const now = new Date();
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dayName = days[now.getDay()];

const date = now.getDate();
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const month = now.getMonth();
const year = now.getFullYear();
const fullDate = `${date.toString().padStart(2, "0")} ${months[month]} ${year}`;
document.querySelector("#dayName").innerText = dayName;
document.querySelector("#todayDate").innerText = fullDate;

// Change bg of current day
let currDay;
weekDays.forEach((day) => {
  if (day.innerText.trim() === dayName) {
    currDay = day.parentElement.parentElement;
    currDay.classList.add("current-day-light");
  }
});

// LOADER
const showLoader = () => {
  document.querySelector("#loader").style.display = "flex";
};

const hideLoader = () => {
  const loader = document.querySelector("#loader"); // define loader first
  loader.style.setProperty("display", "none", "important");
  // console.log("Loader hidden.");
};
// Changing Theme
let dark = false;
lightBtn.addEventListener("click", () => {
  lightModeBg.forEach((element) => {
    element.classList.toggle("dark");
  });
  lightModeText.forEach((el) => {
    el.classList.toggle("dark-text");
  });
  lightIcon.forEach((el) => {
    el.classList.toggle("sun-dark");
  });
  darkThemebody.classList.toggle("dark-theme-body");
  darkThemeleft.classList.toggle("dark-theme-left");
  currDay.classList.toggle("current-day-dark");
  if (!dark) {
    // Switched to dark mode
    if (temperature === "cel") {
      celSelect.classList.remove("selected-temp");
      celSelect.classList.add("selected-temp-dark");
    } else {
      fehSelect.classList.remove("selected-temp");
      fehSelect.classList.add("selected-temp-dark");
    }
  } else {
    // Switched to light mode
    if (temperature === "cel") {
      celSelect.classList.remove("selected-temp-dark");
      celSelect.classList.add("selected-temp");
    } else {
      fehSelect.classList.remove("selected-temp-dark");
      fehSelect.classList.add("selected-temp");
    }
  }

  dark = !dark;
});

// Change between Celsius and fehrenhite
let temperature = "cel";
fehSelect.addEventListener("click", () => {
  if (temperature === "cel") {
    allTemperatures.forEach((te) => {
      let cel = te.innerText;
      let feh = (9 / 5) * cel + 32;
      te.innerText = feh.toFixed(1);
    });
  }
  if (!dark) {
    celSelect.classList.remove("selected-temp");
    fehSelect.classList.add("selected-temp");
  } else {
    celSelect.classList.remove("selected-temp-dark");
    fehSelect.classList.add("selected-temp-dark");
  }
  temperature = "feh";
});
celSelect.addEventListener("click", () => {
  if (temperature === "feh") {
    allTemperatures.forEach((te) => {
      let feh = te.innerText;
      let cel = ((feh - 32) * 5) / 9;
      te.innerText = cel.toFixed(1);
    });
  }
  if (!dark) {
    celSelect.classList.add("selected-temp");
    fehSelect.classList.remove("selected-temp");
  } else {
    celSelect.classList.add("selected-temp-dark");
    fehSelect.classList.remove("selected-temp-dark");
  }
  temperature = "cel";
});

// Fetch Weather
const fetchWeather = async (lat, lon) => {
  showLoader();
  try {
    // Fetching Main API for every detail
    let mainLat = lat;
    let mainLon = lon;
    const res = await fetch(`/.netlify/functions/getForecast?lat=${mainLat}&lon=${mainLon}`);
    const data = await res.json();

    // Today's Temperature
    const todayTemp = data.current.temp_c;
    document.querySelector("#todayTemp").innerText = todayTemp;

    // Weather Description
    document.querySelector("#weather-des-icon").src =
      "https:" + data.current.condition.icon.replace("64x64", "128x128");
    document.querySelector("#temp-description").innerText =
      data.current.condition.text;

    // Wind Speed
    document.querySelector("#wind-speed").innerText =
      data.current.wind_kph + " km/h";

    // Humidity
    document.querySelector("#humidity").innerText =
      data.current.humidity + " %";

    // Visibility
    document.querySelector("#visibility").innerText =
      data.current.vis_km + "km";

    // Sunrise
    document.querySelector("#sunrise-time").innerText =
      data.forecast.forecastday[0].astro.sunrise;

    // Sunset
    document.querySelector("#sunset-time").innerText =
      data.forecast.forecastday[0].astro.sunset;

    // AQI
    const aqiRes = await fetch(`/.netlify/functions/getAqi?lat=${mainLat}&lon=${mainLon}`);
    const aqiData = await aqiRes.json();
    const aqiVal = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    document.querySelector("#aqiIdx").innerText = aqiData.list[0].main.aqi;
    document.querySelector("#aqiVal").innerText =
      aqiVal[aqiData.list[0].main.aqi - 1];

    // UV Index
    document.querySelector("#uv-idx").innerText = data.current.uv;

    // Weather Icon
    document.querySelector("#weather-icon-big").src =
      "https:" +
      data.forecast.forecastday[0].day.condition.icon.replace(
        "64x64",
        "128x128"
      );

    data.forecast.forecastday.forEach((day, i) => {
      const iconURL =
        "https:" + day.day.condition.icon.replace("64x64", "128x128");
      document.querySelectorAll(".forecast-icon")[i].src = iconURL;

      const maxtemps = day.day.maxtemp_c;
      const mintemps = day.day.mintemp_c;
      // console.log(maxtemps);
      document.querySelectorAll(".forecast-max-temps")[i].innerText =
        " " + maxtemps;
      document.querySelectorAll(".forecast-min-temps")[i].innerText =
        " " + mintemps;

    });
  } catch (err) {
    console.error("Failed to fetch weather:", err.message);
  } finally {
    hideLoader();
  }
};

const fetchByCity = async (cityName) => {
  showLoader();
  try {
    const cityRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`);
    const cityData = await cityRes.json();
    const cityLat = cityData.coord.lat;
    const cityLon = cityData.coord.lon;
    await fetchWeather(cityLat, cityLon);
    
    // City Name on Banner
    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    // console.log(cityName);
    document.querySelector("#city-name-banner").innerText = cityName;

  } catch (err) {
    console.error("City fetch failed:", err.message);
  } finally {
    hideLoader();
  }
};

// Search by City
searchBar.addEventListener("keypress", (e) => {
  let cityName;
  if (e.key === "Enter") {
    cityName = e.target.value.trim();
    console.log(cityName);
    fetchByCity(cityName);
  }
});

window.addEventListener("DOMContentLoaded", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const autolat = pos.coords.latitude;
        const autolon = pos.coords.longitude;
        // console.log(`${autolat}, ${autolon}`);
        fetchWeather(autolat,autolon); // Correct format: "28.61,77.23"
      },
      (error) => {
        console.warn("Location access denied. Falling back to Delhi.");
        fetchByCity(DEFAULT_CITY);
      }
    );
  } else {
    console.warn("Geolocation not supported. Using Delhi.");
    fetchByCity(DEFAULT_CITY);
  }
});
