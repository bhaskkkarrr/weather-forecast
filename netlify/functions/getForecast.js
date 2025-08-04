// netlify/functions/getForecast.js

export async function handler(event, context) {
  const forecastKey = process.env.FORECAST_API_KEY;
  const { lat, lon } = event.queryStringParameters;

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${forecastKey}&q=${lat},${lon}&days=7`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
