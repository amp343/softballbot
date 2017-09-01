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

import { getQuote } from './quotes'
import { getWeatherMessage } from './weather'
import { getConfig } from './config'
import { getRainoutMessage } from './rainout'
import { getLineupMessage, getLineupTable } from './lineup'

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
    getConfig('weather')
    .then(({ apiKey, lat, lng }) =>
      send(msg, () => getWeatherMessage(apiKey, lat, lng))
    )
  )

  //
  // check whether the game is on
  //
  robot.hear(/gameon/i, msg =>
    send(msg, () => getRainoutMessage())
  )

  //
  // print the lineup
  //
  robot.hear(/^lineup/i, msg =>
    getConfig('lineup')
    .then(({ ssKey, ssIdx, ssRange }) =>
      send(msg, () => getLineupMessage(ssKey, ssIdx, ssRange))
    )
  )

  //
  // print the lineup in a table
  //
  robot.hear(/^pretty lineup/i, msg =>
    getConfig('lineup')
    .then(({ ssKey, ssIdx, ssRange }) =>
      send(msg, () => getLineupTable(ssKey, ssIdx, ssRange, {
        colDelim: '',
        headerDelim: '-',
        cellPadding: 1
      }))
    )
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
