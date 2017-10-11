// Description:
//   Softball bot
//
// Dependencies:
//   None
//
// Commands:
//   motivate - Motivate the team with an inspirational quote
//   depress - Depress the team with a morose quote
//   gameon - Is our game on?
//   weather - Get a weather report
//   lineup - Get the lineup
//   pretty lineup - Get the lineup as a nice table
//
// Author:
//   amp343
//

import { checkIn, checkOut, getCheckedInUsersMsg } from './checkin'
import { getAllUsers, atUser } from './users'
import { getQuote } from './quotes'
import { getWeatherMessage } from './weather'
import { getConfig } from './config'
import { getNextGameNumber } from './gameday'
import { getRainoutMessage } from './rainout'
import { getLineupMessage, getLineupTable } from './lineup'
import { getMentionedUser, getMsgUser } from './util'

//
// interface for sending a message
//
export const send = (msg, promise) =>
  promise()
  .then(result => msg.send(result))


module.exports = robot => {
  //
  // print a motivational quote
  //
  robot.hear(/motivate/i, msg =>
    send(msg, () => getQuote('motivational'))
  )

  //
  // print a depressing quote
  //
  robot.hear(/depress/i, msg =>
    send(msg, () => getQuote('depressing'))
  )

  //
  // print a weather report
  //
  robot.hear(/^weather/i, msg =>
    send(msg, () =>
      getConfig('weather')
      .then(({ apiKey, lat, lng }) => getWeatherMessage(apiKey, lat, lng))
    )
  )

  //
  // check whether the game is on
  //
  robot.hear(/gameon/i, msg =>
    send(msg, () =>
      getConfig('rainout')
      .then(({ url }) => getRainoutMessage(url))
    )
  )

  //
  // print the lineup
  //
  robot.hear(/^lineup/i, msg =>
    send(msg, () =>
      getConfig('lineup')
      .then(({ ssKey, ssIdx, ssRange }) => getLineupMessage(ssKey, ssIdx, ssRange))
    )
  )

  //
  // print the lineup in a table
  //
  robot.hear(/^pretty lineup/i, msg =>
    send(msg, () =>
      getConfig('lineup')
      .then(({ ssKey, ssIdx, ssRange }) =>
        getLineupTable(ssKey, ssIdx, ssRange, {
          cellPadding: 1,
          colDelim: '',
          headerDelim: '-',
        })
      )
    )
  )

  robot.hear(/^checkin$/i, msg =>
    send(msg, async () =>
      checkIn(await getMsgUser(msg), robot, await getNextGameNumber())
    )
  )

  robot.hear(/^checkin @/i, msg => {
    send(msg, async () =>
      checkIn(getMentionedUser(msg), robot, await getNextGameNumber())
    )
  })

  robot.hear(/^checkout$/i, msg =>
    send(msg, async () =>
      checkOut(await getMsgUser(msg), robot, await getNextGameNumber())
    )
  )

  robot.hear(/^checkout @/i, msg =>
    send(msg, async () =>
      checkOut(getMentionedUser(msg), robot, await getNextGameNumber())
    )
  )

  robot.hear(/^whoin$/i, msg =>
    send(msg, async () =>
      getCheckedInUsersMsg(robot, await getNextGameNumber())
    )
  )

  robot.hear(/^hiap$/i, msg =>
    // send(msg, () => Promise.resolve(getAllUsers()))
    // send(msg, () =>
    //   getAllUsers()
    //   .then(x => x.map(atUser))
    //   .then(x => {
    //
    //   })
    // )
    robot.messageRoom('@apeters', 'ping')
  )
}

//
// #
// # show stat leaders
// #
// robot.hear /leaders/i, (msg) ->
//   send msg, () -> leaders.getMessage msg

// #
// # print a scouting report
// #
// robot.hear /^scout/i, (msg) ->
//   send msg, () -> scout.getMessage msg
//
