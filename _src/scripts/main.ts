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

import R from "ramda";
import { IObj } from "../types";
import { program } from "../util/fn";
import { checkIn, checkOut, getCheckedInUsersMsg } from "./checkin";
// import { checkIn, checkOut } from "./checkin";
import { getConfig, getTeamConfig } from "./config";
import { getDayFromMsg, getNextGameNumber, getUsernameFromMsg } from "./gameday";
import { getLineupMessage, getLineupTable } from "./lineup";
import { getQuote } from "./quotes";
import { getRainoutMessage } from "./rainout";
import { getMsgUserName } from "./users";
import { buildWeatherUrl, getWeatherMessage } from "./weather";
//
// interface for sending a message
//
export const send = R.curry(async (msg: IObj, fn: () => Promise<string>): Promise<any> => {
  try {
    return await program(
      fn,
      (x) => msg.send(x),
    )();
  } catch (e) {
    msg.send(e);
    return;
  }
});

module.exports = (robot) => {
  //
  // print a motivational quote
  //
  robot.hear(/^motivate$/i, (msg: IObj) =>
    send(msg, () => getQuote("motivational")),
  );

  //
  // print a depressing quote
  //
  robot.hear(/^depress$/i, (msg: IObj) =>
    send(msg, () => getQuote("depressing")),
  );

  //
  // print a weather report
  //
  robot.hear(/^weather$/i, (msg: IObj) =>
    send(msg, () =>
      getConfig("weather")
        .then(({ apiKey, lat, lng }) =>
          getWeatherMessage(buildWeatherUrl(apiKey, lat, lng)),
        ),
    ),
  );

  //
  // check whether the game is on
  //
  robot.hear(/^gameon( \w+)?$/i, (msg: IObj) =>
    send(msg, async () =>
      Promise.resolve(getDayFromMsg(msg, 1))
        .then(async (day) => await getTeamConfig(day, "rainout"))
        .then(({ url }) => getRainoutMessage(url)),
    ),
  );

  //
  // print the lineup
  //
  robot.hear(/^lineup( \w+)?$/i, (msg: IObj) =>
    send(msg, () =>
      Promise.resolve(getDayFromMsg(msg, 1))
        .then((day) => getTeamConfig(day, "lineup"))
        .then(({ ssKey, ssIdx, ssRange }) => getLineupMessage(ssKey, ssIdx)),
    ),
  );

  //
  // print the lineup in a table
  //
  robot.hear(/^pretty lineup( \w+)?$/i, (msg: IObj) =>
    send(msg, () =>
      Promise.resolve(getDayFromMsg(msg, 1))
        .then((day) => getTeamConfig(day, "lineup"))
        .then(({ ssKey, ssIdx }) =>
          getLineupTable(ssKey, ssIdx, {
            cellPadding: 1,
            colDelim: "",
            headerDelim: "-",
          }),
      ),
    ),
  );

  robot.hear(/^checkin( \w+)?$/i, (msg: IObj) =>
    send(msg, async () =>
      Promise.resolve(getDayFromMsg(msg, 1))
        .then(async (day) =>
          checkIn(robot, await getNextGameNumber(), day, getMsgUserName(msg))),
    ),
  );

  robot.hear(/^checkin @(\w+)( \w+)?$/i, (msg: IObj) =>
    send(msg, async () =>
      Promise.resolve(getDayFromMsg(msg, 2))
        .then(async (day) => checkIn(robot, await getNextGameNumber(), day))
        .then(async (curried) => curried(await getUsernameFromMsg(msg, 1))),
    ),
  );

  robot.hear(/^checkout( \w+)?$/i, (msg: IObj) =>
    send(msg, async () =>
      Promise.resolve(getDayFromMsg(msg, 1))
        .then(async (day) =>
          checkOut(robot, await getNextGameNumber(), day, getMsgUserName(msg))),
    ),
  );

  robot.hear(/^checkout @(\w+)( \w+)?$/i, (msg: IObj) =>
    send(msg, async () =>
      Promise.resolve(getDayFromMsg(msg, 2))
        .then(async (day) => checkOut(robot, await getNextGameNumber(), day))
        .then(async (curried) => curried(await getUsernameFromMsg(msg, 1))),
    ),
  );

  robot.hear(/^whoin( \w+)?$/i, (msg: IObj) =>
    send(msg, async () =>
      getCheckedInUsersMsg(
        robot,
        await getNextGameNumber(),
        await getDayFromMsg(msg, 1),
      ),
    ),
  );

  robot.hear(/^hiap$/i, (msg: IObj) =>
    robot.messageRoom("@apeters", "ping"),
  );
};

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
