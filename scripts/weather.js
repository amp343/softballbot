import moment from 'moment'
import request from 'request-promise'


export const buildUrl = (apiKey, lat, lng) =>
  'https://api.forecast.io/forecast/' + apiKey + '/' + lat + ',' + lng

export const fetchWeather = (apiKey, lat, lng) =>
  request(buildUrl(apiKey, lat, lng))

export const getWeatherMessage = (apiKey, lat, lng) =>
  fetchWeather(apiKey, lat, lng)
  .then(transformResponseToJson)
  .then(transformJsonToMessage)

export const transformResponseToJson = response =>
  JSON.parse(response).hourly.data.map(el => ({
    summary: el.summary,
    precipProbability: el.precipProbability,
    temperature: el.temperature
  }))

export const transformJsonToMessage = weatherResult =>
  [
    ' *Weather report:*',
    '----------------------------'
  ].concat(weatherResult.slice(0, 8).map(getReportRowMessage))
  .join('\n')

export const getReportRowMessage = (row, idx) =>
  ` *${parseHours(idx)}* - ${row.summary}, \
${parseTemperature(row.temperature)}, \
${parsePrecipProbability(row.precipProbability)} chance of rain`

export const parseHours = idx =>
  moment().add(idx, 'hours').format('h:mm a')

export const parseTemperature = temp =>
  `${temp.toFixed(0)}°`

export const parsePrecipProbability = precipProbability =>
  `${parseFloat(precipProbability) * 100}%`
