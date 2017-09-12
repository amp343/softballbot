require('dotenv').config()


export const getConfig = (type) =>
  Promise.resolve({
    weather: {
      apiKey: process.env.WEATHER_API_KEY,
      lat: process.env.WEATHER_LAT,
      lng: process.env.WEATHER_LNG,
    },
    lineup: {
      ssKey: process.env.LINEUP_SS_KEY,
      ssIdx: process.env.LINEUP_SS_IDX,
    },
    games: {
      next: process.env.NEXT_GAME,
    }
  }).then(cfg =>
    type
      ? cfg[type]
      : cfg
  )
