import * as _ from "lodash";
import moment from "moment";
import * as R from "ramda";
import rp from "request-promise-native";
import { IFormattedWeatherResult, IWeatherResponseJson, IWeatherResult } from "../types";
import { mapIndexed, program } from "../util/fn";

export const getWeatherMessage = (url: string): Promise<any> =>
  program(
    getUrl,
    jsonify,
    parseHourlyData,
    R.slice(0, 8),
    R.map(pruneWeatherResult),
    mapIndexed(formatWeatherResult),
    R.map(formattedWeatherResultToStr),
    buildFullMessage,
  )(url);

export const getUrl = async (url: string): Promise<string> => rp.get(url);

export const jsonify = (resp: string): IWeatherResponseJson => JSON.parse(resp);

export const parseHourlyData = (resp: IWeatherResponseJson): IWeatherResult[] => resp.hourly.data;

export const buildWeatherUrl = R.curry((apiKey: string, lat: string, lng: string): string =>
    `https://api.forecast.io/forecast/${apiKey}/${lat},${lng}`);

export const buildFullMessage = (weatherResults: string[]): string =>
  [
    " *Weather report:*",
    "----------------------------",
  ].concat(weatherResults).join("\n");

export const pruneWeatherResult = (w: IWeatherResult): IWeatherResult =>
  _.pick(w, ["summary", "precipProbability", "temperature"]);

export const formatWeatherResult = (w: IWeatherResult, i: number): IFormattedWeatherResult => ({
  ...w,
  precipProbability: parsePrecipProbability(w.precipProbability),
  temperature: parseTemperature(w.temperature),
  time: parseHours(i),
});

export const formattedWeatherResultToStr = (w: IFormattedWeatherResult): string =>
  ` *${w.time}* - ${w.summary}, \
  ${w.temperature}, \
  ${w.precipProbability} chance of rain`;

export const parseHours = (idx: any): string =>
  moment().add(idx, "hours").format("h:mm a");

export const parseTemperature = (temp: number): string =>
  `${temp.toFixed(0)}°`;

export const parsePrecipProbability = (precipProbability: string): string =>
  `${parseFloat(precipProbability) * 100}%`;
