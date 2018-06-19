import { IObj, IUserObj } from "../types";
import { getConfig, getTeamConfig } from "./config";

export const getMsgUser = (msg: IObj): IUserObj => msg.message.user;

export const getMsgUserName = (msg: IObj): string => msg.message.user.name;

export const getMentionedUser = (msg: IObj) => {
  const match = msg.message.text.match(/@([\w\-\.]+)/);
  return match ? { name: match[1] } : null;
};

export const atUser = (username: string): string =>
  username[0] !== "@" ? `@${username}` : username;

export const getTeam = async (day: string): Promise<string[]> =>
  getConfig("teams")
    .then((x) => x[day]);

export const getTuesdayTeam = (): Promise<string[]> => getTeamConfig("tues", "roster");

export const getWednesdayTeam = (): Promise<string[]> => getTeamConfig("wed", "roster");

export const getAllPlayers = (): Promise<string[]> => getTeamConfig("all", "roster");

export const onTuesdayTeam = (username: string): Promise<boolean> =>
  getTuesdayTeam()
    .then((x) => x.includes(username));

export const onWednesdayTeam = (username: string): Promise<boolean> =>
  getWednesdayTeam()
    .then((x) => x.includes(username));

export const onAnyTeam = (username: string): Promise<boolean> =>
  getAllPlayers()
    .then((x) => x.includes(username));
