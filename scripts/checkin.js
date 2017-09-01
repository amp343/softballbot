import _ from 'lodash'
import moment from 'moment'
import { robotBrainGet, robotBrainSet } from './brain'

export const alreadyCheckedInMsg = username =>
  `${username} is already checked in`

export const alreadyCheckedOutMsg = username =>
  `${username} is already checked out`

export const checkedInMsg = username =>
  `Checked in ${username}`

export const checkedOutMsg = username =>
  `Checked out ${username}`

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

export const getGameKey = () =>
  `${moment().format('YYYYMMDD')}_checkin`
