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
    },
    rainout: {
      url: process.env.RAINOUT_URL,
    },
    users: process.env.SLACK_USERS.split(',')
  }).then(cfg =>
    type
      ? cfg[type]
      : cfg
  )
