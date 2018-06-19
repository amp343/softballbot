require("dotenv").config();

const CONFIG = {
  games: {
    next: process.env.NEXT_GAME,
  },
  teams: {
    all: {
      roster: process.env.TUES_TEAM.split(",").concat(process.env.WED_TEAM.split(",")),
    },
    tues: {
      lineup: {
        ssIdx: parseInt(process.env.NEXT_GAME, 10) - 1,
        ssKey: process.env.LINEUP_SS_KEY_TUES,
      },
      rainout: {
        url: process.env.RAINOUT_URL_TUES,
      },
      roster: process.env.TUES_TEAM.split(","),
    },
    wed: {
      lineup: {
        ssIdx: parseInt(process.env.NEXT_GAME, 10) - 1,
        ssKey: process.env.LINEUP_SS_KEY_WED,
      },
      rainout: {
        url: process.env.RAINOUT_URL_WED,
      },
      roster: process.env.WED_TEAM.split(","),
    },
  },
  weather: {
    apiKey: process.env.WEATHER_API_KEY,
    lat: process.env.WEATHER_LAT,
    lng: process.env.WEATHER_LNG,
  },
};

export const getConfig = async (type?: string): Promise<any> =>
  Promise.resolve(CONFIG)
    .then((cfg) => type ? cfg[type] : cfg);

export const getTeamConfig = async (day: string, type?: string): Promise<any> =>
  Promise.resolve(CONFIG)
    .then((cfg) => cfg.teams[day])
    .then((cfg) => type ? cfg[type] : cfg);
