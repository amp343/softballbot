import _ from 'lodash'
import moment from 'moment'
import { getConfig } from './config'
import { codeBlock } from './util'

export const gamedayMsg = msg => {
  const msgList = [codeBlock(msg)]
  if (!isGameday()) {
    msgList.unshift(getNoGamedayMessage())
  }
  return msgList.join('\n')
}

export const getNoGamedayMessage = () =>
  _.shuffle(getNoGamedayMessages())[0]

export const getNoGamedayMessages = () =>
  [
    'Today is not a gameday, but ok ...',
    'You do realize today is not a gameday...',
    'This is totally pointless, but ok...',
    'No game today bruh...',
    `This would be more useful in ${getDaysTilGameday()} days...`
  ]

export const getDaysTilGameday = () => {
  const today = moment().weekday()
  const gameday = 3
  return today > gameday
    ? 7 - today + gameday
    : gameday - today
}

export const isGameday = () =>
  _.includes(getGamedays(), moment().weekday())

export const getGamedays = () =>
  [2, 3]

export const getNextGameNumber = () =>
  getConfig('games').
  then(cfg => cfg.next)
