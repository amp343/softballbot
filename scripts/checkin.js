import _ from 'lodash'
import moment from 'moment'
import { robotBrainGet, robotBrainSet } from './brain'
import { gamedayMsg } from './gameday'

export const alreadyCheckedInMsg = username =>
  gamedayMsg(`${username} is already checked in`)

export const alreadyCheckedOutMsg = username =>
  gamedayMsg(`${username} is already checked out`)

export const checkedInMsg = username =>
  gamedayMsg(`Checked in ${username}`)

export const checkedOutMsg = username =>
  gamedayMsg(`Checked out ${username}`)

export const checkIn = (user, robot) =>
  getCheckedInUsers(robot)
  .then(users =>
    _.includes(users, user.name)
      ? alreadyCheckedInMsg(user.name)
      : robotBrainSet(robot, getGameKey(), users.concat(user.name))
        .then(x => checkedInMsg(user.name))
  )

export const checkOut = (user, robot) =>
  getCheckedInUsers(robot)
  .then(users =>
    _.includes(users, user.name)
      ? robotBrainSet(robot, getGameKey(), _.remove(users, user.name))
        .then(x => checkedOutMsg(user.name))
      : alreadyCheckedOutMsg(user.name)
  )

export const getCheckedInUsers = robot =>
  robotBrainGet(robot, getGameKey())
  .then(users => users || [])

export const getCheckedInUsersMsg = robot =>
  getCheckedInUsers(robot)
  .then(users => gamedayMsg(users.join('\n')))

export const getGameKey = () =>
  `${moment().format('YYYYMMDD')}_checkin`
