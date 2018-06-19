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
import { getConfig } from "./config";
import { getNextGameNumber } from "./gameday";
import { getLineupMessage, getLineupTable } from "./lineup";
import { getQuote } from "./quotes";
import { getRainoutMessage } from "./rainout";
import { assertTuesdayTeam, getMentionedUser, getMsgUser, getMsgUserName } from "./users";
import { buildWeatherUrl, getWeatherMessage } from "./weather";
//
// interface for sending a message
//
export const send = R.curry(async (msg: IObj, fn: () => Promise<string>): Promise<any> => {
  // only blessed tuesday team users allowed
  try {
    await assertTuesdayTeam(getMsgUserName(msg));
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
  robot.hear(/motivate/i, (msg: IObj) =>
    send(msg, () => getQuote("motivational")),
  );

  //
  // print a depressing quote
  //
  robot.hear(/depress/i, (msg: IObj) =>
    send(msg, () => getQuote("depressing")),
  );

  //
  // print a weather report
  //
  robot.hear(/^weather/i, (msg: IObj) =>
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
  robot.hear(/gameon/i, (msg: IObj) =>
    send(msg, () =>
      getConfig("rainout")
      .then(({ url }) => getRainoutMessage(url)),
    ),
  );

  //
  // print the lineup
  //
  robot.hear(/^lineup/i, (msg: IObj) =>
    send(msg, () =>
      getConfig("lineup")
      .then(({ ssKey, ssIdx, ssRange }) => getLineupMessage(ssKey, ssIdx, ssRange)),
    ),
  );

  //
  // print the lineup in a table
  //
  robot.hear(/^pretty lineup/i, (msg: IObj) =>
    send(msg, () =>
      getConfig("lineup")
      .then(({ ssKey, ssIdx, ssRange }) =>
        getLineupTable(ssKey, ssIdx, ssRange, {
          cellPadding: 1,
          colDelim: "",
          headerDelim: "-",
        }),
      ),
    ),
  );

  robot.hear(/^checkin$/i, (msg: IObj) =>
    send(msg, async () =>
      checkIn(await getMsgUser(msg), robot, await getNextGameNumber()),
    ),
  );

  // robot.hear(/^user$/i, (msg: IObj) =>
  //   send(msg, async () =>
  //     Promise.resolve(getMsgUser(msg))
  //       .then(JSON.stringify),
  //   ),
  // );

  robot.hear(/^checkin @/i, (msg: IObj) => {
    send(msg, async () =>
      checkIn(getMentionedUser(msg), robot, await getNextGameNumber()),
    );
  });

  robot.hear(/^checkout$/i, (msg: IObj) =>
    send(msg, async () =>
      checkOut(await getMsgUser(msg), robot, await getNextGameNumber()),
    ),
  );

  robot.hear(/^checkout @/i, (msg: IObj) =>
    send(msg, async () =>
      checkOut(getMentionedUser(msg), robot, await getNextGameNumber()),
    ),
  );

  robot.hear(/^whoin$/i, (msg: IObj) =>
    send(msg, async () =>
      getCheckedInUsersMsg(robot, await getNextGameNumber()),
    ),
  );

  // robot.hear(/^team$/i, (msg: IObj) =>
  //   send(msg, async () =>
  //     getTeam("tues")
  //       .then((x) => x.join("\n")),
  //   ),
  // );

  robot.hear(/^hiap$/i, (msg: IObj) =>
    // send(msg, () => Promise.resolve(getAllUsers()))
    // send(msg, () =>
    //   getAllUsers()
    //   .then(x => x.map(atUser))
    //   .then(x => {
    //
    //   })
    // )
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
