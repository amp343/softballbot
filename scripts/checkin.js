import _ from 'lodash'
import moment from 'moment'
import { robotBrainGet, robotBrainSet } from './brain'
import { getConfig } from './config'
import { gamedayMsg } from './gameday'

export const alreadyCheckedInMsg = (username, gameNumber) =>
  gamedayMsg(`${username} is already checked in for game ${gameNumber}`)

export const alreadyCheckedOutMsg = (username, gameNumber) =>
  gamedayMsg(`${username} is already checked out for game ${gameNumber}`)

export const checkedInMsg = (username, gameNumber) =>
  gamedayMsg(`Checked in ${username} for game ${gameNumber}`)

export const checkedOutMsg = (username, gameNumber) =>
  gamedayMsg(`Checked out ${username} for game ${gameNumber}`)

export const checkIn = (user, robot, gameNumber) =>
  getCheckedInUsers(robot, gameNumber)
  .then(users =>
    _.includes(users, user.name)
      ? alreadyCheckedInMsg(user.name, gameNumber)
      : robotBrainSet(robot, getGameKey(gameNumber), users.concat(user.name))
        .then(x => checkedInMsg(user.name, gameNumber))
  )

export const checkOut = (user, robot, gameNumber) =>
  getCheckedInUsers(robot, gameNumber)
  .then(users =>
    _.includes(users, user.name)
      ? robotBrainSet(robot, getGameKey(gameNumber), _.remove(users, user.name))
        .then(x => checkedOutMsg(user.name, gameNumber))
      : alreadyCheckedOutMsg(user.name, gameNumber)
  )

export const getCheckedInUsers = (robot, gameNumber) =>
  robotBrainGet(robot, getGameKey(gameNumber))
  .then(users => users || [])

export const getCheckedInUsersMsg = (robot, gameNumber) =>
  getCheckedInUsers(robot, gameNumber)
  .then(users => gamedayMsg(
    formatCheckedInUsersMsg(users, gameNumber)
  ))

export const formatCheckedInUsersMsg = (users, gameNumber) =>
  [`*Game ${gameNumber}*`, ''].concat(
    users.length ? users : ['-']
  ).join('\n')

export const getGameKey = gameNumber =>
  `game_${gameNumber}_checkin`
