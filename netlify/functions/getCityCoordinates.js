export async function handler(event) {
  const key = process.env.AQI_API_KEY;
  const { city } = event.queryStringParameters;

  if (!city) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "City parameter is missing" }),
    };
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: data.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        lat: data.coord.lat,
        lon: data.coord.lon,
        city: data.name,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
