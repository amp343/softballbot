import * as _ from "lodash";
import * as R from "ramda";
import { IRobot } from "../types";
import { robotBrainGet, robotBrainSet } from "./brain";
import { gamedayMsg } from "./gameday";

export const alreadyCheckedInMsg = (username: string, gameNumber: number, day: string): string =>
  gamedayMsg(`${username} is already checked in for ${day} game ${gameNumber}`);

export const alreadyCheckedOutMsg = (username: string, gameNumber: number, day: string): string =>
  gamedayMsg(`${username} is already checked out for ${day} game ${gameNumber}`);

export const checkedInMsg = (username: string, gameNumber: number, day: string): string =>
  gamedayMsg(`Checked in ${username} for ${day} game ${gameNumber}`);

export const checkedOutMsg = (username: string, gameNumber: number, day): string =>
  gamedayMsg(`Checked out ${username} for ${day} game ${gameNumber}`);

export const checkIn = R.curry((robot: IRobot, gameNumber: number, day: string, username: string) =>
  getCheckedInUsers(robot, gameNumber, day)
  .then((users) =>
    users.includes(username)
      ? alreadyCheckedInMsg(username, gameNumber, day)
      : robotBrainSet(robot, getGameKey(gameNumber, day), users.concat(username))
        .then((x) => checkedInMsg(username, gameNumber, day)),
  ));

export const checkOut = R.curry((robot: IRobot, gameNumber: number, day: string, username: string) =>
  getCheckedInUsers(robot, gameNumber, day)
  .then((users) =>
    users.includes(username)
      ? robotBrainSet(robot, getGameKey(gameNumber, day), _.without(users, username))
        .then((x) => checkedOutMsg(username, gameNumber, day))
      : alreadyCheckedOutMsg(username, gameNumber, day),
  ));

export const getCheckedInUsers = (robot: IRobot, gameNumber: number, day: string): Promise<string[]> =>
  robotBrainGet(robot, getGameKey(gameNumber, day))
    .then((users) => users || []);

export const getCheckedInUsersMsg = (robot: IRobot, gameNumber: number, day: string): Promise<string> =>
  getCheckedInUsers(robot, gameNumber, day)
    .then((users) => gamedayMsg(
      formatCheckedInUsersMsg(users, gameNumber, day),
    ));

export const formatCheckedInUsersMsg = (users: string[], gameNumber: number, day: string): string =>
  [`*Game ${gameNumber}* (${day})`, ""].concat(
    users.length ? users : ["<< crickets >>"],
  ).join("\n");

export const getGameKey = (gameNumber: number, day: string): string =>
  `game_${gameNumber}_${day}_checkin`;
