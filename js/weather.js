const WEATHER_CODES = {
  0:["☀️","Clear"],1:["🌤️","Mostly clear"],2:["⛅","Partly cloudy"],3:["☁️","Cloudy"],
  45:["🌫️","Fog"],48:["🌫️","Icy fog"],51:["🌦️","Light drizzle"],53:["🌦️","Drizzle"],55:["🌧️","Heavy drizzle"],
  61:["🌦️","Light rain"],63:["🌧️","Rain"],65:["🌧️","Heavy rain"],66:["🌧️","Freezing rain"],67:["🌧️","Freezing rain"],
  71:["🌨️","Light snow"],73:["🌨️","Snow"],75:["❄️","Heavy snow"],77:["🌨️","Snow grains"],
  80:["🌦️","Rain showers"],81:["🌧️","Rain showers"],82:["⛈️","Heavy showers"],85:["🌨️","Snow showers"],86:["❄️","Heavy snow showers"],
  95:["⛈️","Thunderstorm"],96:["⛈️","Storm with hail"],99:["⛈️","Storm with hail"]
};

function withTimeout(url, ms = 9000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

export async function fetchThanksgivingWeather(place) {
  const query = String(place || "").trim();
  if (!query) throw new Error("Add a city or ZIP code first.");
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
  const geoResponse = await withTimeout(geoUrl);
  if (!geoResponse.ok) throw new Error("Location search is unavailable right now.");
  const geo = await geoResponse.json();
  const hit = geo.results?.[0];
  if (!hit) throw new Error("That location was not found. Try a city and state or ZIP code.");

  const params = new URLSearchParams({
    latitude:String(hit.latitude), longitude:String(hit.longitude), timezone:"auto",
    temperature_unit:"fahrenheit", wind_speed_unit:"mph", precipitation_unit:"inch",
    current:"temperature_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,precipitation",
    daily:"weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset",
    forecast_days:"7"
  });
  const forecastResponse = await withTimeout(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!forecastResponse.ok) throw new Error("The forecast is unavailable right now.");
  const forecast = await forecastResponse.json();
  return normalize(hit, forecast);
}

function normalize(hit, data) {
  const currentCode = Number(data.current?.weather_code ?? 3);
  const days = (data.daily?.time || []).map((date, index) => {
    const code = Number(data.daily.weather_code?.[index] ?? 3);
    const [icon, label] = WEATHER_CODES[code] || ["🌦️","Mixed weather"];
    return {
      date, icon, label,
      high:Math.round(data.daily.temperature_2m_max?.[index]),
      low:Math.round(data.daily.temperature_2m_min?.[index]),
      rain:Math.round(data.daily.precipitation_probability_max?.[index] || 0),
      sunrise:data.daily.sunrise?.[index] || null,
      sunset:data.daily.sunset?.[index] || null
    };
  });
  const [icon, label] = WEATHER_CODES[currentCode] || ["🌦️","Mixed weather"];
  return {
    place:[hit.name, hit.admin1].filter(Boolean).join(", "),
    timezone:data.timezone,
    fetchedAt:new Date().toISOString(),
    current:{
      icon,label,temp:Math.round(data.current?.temperature_2m),feels:Math.round(data.current?.apparent_temperature),
      wind:Math.round(data.current?.wind_speed_10m || 0),precip:Number(data.current?.precipitation || 0)
    },
    days
  };
}

export function weatherForDate(weather, isoDateTime) {
  if (!weather?.days?.length) return null;
  const target = String(isoDateTime || "").slice(0,10);
  return weather.days.find(day => day.date === target) || weather.days[0];
}
