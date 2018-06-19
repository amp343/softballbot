import _ from "lodash";
import { IRobot, IUserObj } from "../types";
import { robotBrainGet, robotBrainSet } from "./brain";
import { gamedayMsg } from "./gameday";

export const alreadyCheckedInMsg = (username: string, gameNumber: number): string =>
  gamedayMsg(`${username} is already checked in for game ${gameNumber}`);

export const alreadyCheckedOutMsg = (username: string, gameNumber: number): string =>
  gamedayMsg(`${username} is already checked out for game ${gameNumber}`);

export const checkedInMsg = (username: string, gameNumber: number): string =>
  gamedayMsg(`Checked in ${username} for game ${gameNumber}`);

export const checkedOutMsg = (username: string, gameNumber: number): string =>
  gamedayMsg(`Checked out ${username} for game ${gameNumber}`);

export const checkIn = (user: IUserObj, robot: IRobot, gameNumber: number) =>
  getCheckedInUsers(robot, gameNumber)
  .then((users) =>
    _.includes(users, user.name)
      ? alreadyCheckedInMsg(user.name, gameNumber)
      : robotBrainSet(robot, getGameKey(gameNumber), users.concat(user.name))
        .then((x) => checkedInMsg(user.name, gameNumber)),
  );

export const checkOut = (user: IUserObj, robot: IRobot, gameNumber: number) =>
  getCheckedInUsers(robot, gameNumber)
  .then((users) =>
    _.includes(users, user.name)
      ? robotBrainSet(robot, getGameKey(gameNumber), _.without(users, user.name))
        .then((x) => checkedOutMsg(user.name, gameNumber))
      : alreadyCheckedOutMsg(user.name, gameNumber),
  );

export const getCheckedInUsers = (robot: IRobot, gameNumber: number): Promise<string[]> =>
robotBrainGet(robot, getGameKey(gameNumber))
  .then((users) => users || []);

export const getCheckedInUsersMsg = (robot: IRobot, gameNumber: number): Promise<string> =>
  getCheckedInUsers(robot, gameNumber)
    .then((users) => gamedayMsg(
      formatCheckedInUsersMsg(users, gameNumber),
    ));

export const formatCheckedInUsersMsg = (users: string[], gameNumber: number): string =>
  [`*Game ${gameNumber}*`, ""].concat(
    users.length ? users : ["<< crickets >>"],
  ).join("\n");

export const getGameKey = (gameNumber: number): string =>
  `game_${gameNumber}_checkin`;
