require("dotenv").config();

const CONFIG = {
  games: {
    next: process.env.NEXT_GAME,
  },
  lineup: {
    ssIdx: parseInt(process.env.NEXT_GAME, 10) - 1,
    ssKey: process.env.LINEUP_SS_KEY,
  },
  rainout: {
    url: process.env.RAINOUT_URL,
  },
  teams: {
    tues: process.env.TUES_TEAM.split(","),
    wed: process.env.WED_TEAM.split(","),
  },
  weather: {
    apiKey: process.env.WEATHER_API_KEY,
    lat: process.env.WEATHER_LAT,
    lng: process.env.WEATHER_LNG,
  },
};

export const getConfig = async (type: string): Promise<any> =>
  Promise.resolve(CONFIG)
    .then((cfg) => type ? cfg[type] : cfg);
