import _ from "lodash";
import moment from "moment";
import { IMsgObj } from "../types";
import { getConfig } from "./config";
import { getAllPlayers } from "./users";
import { codeBlock } from "./util";

export const gamedayMsg = (msg: string): string => {
  const msgList = [codeBlock(msg)];
  if (!isGameday()) {
    msgList.unshift(getNoGamedayMessage());
  }
  return msgList.join("\n");
};

export const getNoGamedayMessage = (): string =>
  _.shuffle(getNoGamedayMessages())[0];

export const getNoGamedayMessages = (): string[] =>
  [
    "Today is not a gameday, but ok ...",
    "You do realize today is not a gameday...",
    "This is totally pointless, but ok...",
    "No game today bruh...",
    `This would be more useful in ${getDaysTilGameday()} days...`,
  ];

export const getDaysTilGameday = (): number => {
  const today = moment().weekday();
  const gameday = 3;
  return today > gameday
    ? 7 - today + gameday
    : gameday - today;
};

export const isGameday = (): boolean =>
  _.includes(getGamedays(), moment().weekday());

export const getGamedays = (): number[] =>
  [1, 2, 3];

export const getNextGameNumber = (): Promise<number> =>
  getConfig("games").
  then((cfg) => cfg.next);

export const getDayFromMsg = (msg: IMsgObj, matchIdx: number = 0): string => {
  let s;
  try {
    s = getMatchFromMsg(msg, matchIdx);
  } catch (e) {
    throw new Error("No day was given in your message. You need to supply the day: 'tues' or 'wed'");
  }
  if (["tuesday", "tues", "tue"].includes(s)) {
    return "tues";
  } else if (["wednesday", "wed"].includes(s)) {
    return "wed";
  } else if (s === "") {
    throw new Error("Doesn't look like you provided a day; try adding 'tues' or 'wed'");
  } else {
    throw new Error(`Did not understand the day in your message: '${s}' is not like 'tues' or 'wed'`);
  }
};

export const getMatchFromMsg = (msg: IMsgObj, matchIdx: number = 0): string =>
  msg.match[matchIdx].trim().toLowerCase();

export const getUsernameFromMsg = async (msg: IMsgObj, matchIdx: number = 0): Promise<string> => {
  const username = msg.match[matchIdx].trim();
  if (!username || username === "") {
    throw new Error(`Username appears to be missing`);
  }
  const allPlayers = await getAllPlayers();
  if (!allPlayers.includes(username)) {
    throw new Error(`Sorry, I don\'t know ${username}`);
  }
  return username;
};
