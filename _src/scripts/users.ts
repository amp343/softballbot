import { IObj, IUserObj } from "../types";
import { getConfig } from "./config";

export const getMsgUser = (msg: IObj): IUserObj => msg.message.user;

export const getMsgUserName = (msg: IObj): string => msg.message.user.name;

export const getMentionedUser = (msg: IObj) => {
  const match = msg.message.text.match(/@([\w\-\.]+)/);
  return match ? { name: match[1] } : null;
};

export const getAllUsers = (): Promise<string[]> => getConfig("users");

export const atUser = (username: string): string =>
  username[0] !== "@" ? `@${username}` : username;

export const getTeam = async (day: string): Promise<string[]> =>
  getConfig("teams")
    .then((x) => x[day]);

export const getTuesdayTeam = (): Promise<string[]> => getTeam("tues");

export const getWednesdayTeam = (): Promise<string[]> => getTeam("wed");

export const onTuesdayTeam = (username: string): Promise<boolean> =>
  getTuesdayTeam()
    .then((x) => x.includes(username));

export const onWednesdayTeam = (username: string): Promise<boolean> =>
  getWednesdayTeam()
    .then((x) => x.includes(username));

export const assertTuesdayTeam = async (username: string): Promise<void> => {
  const team = await getTuesdayTeam();
  if (!team.includes(username)) {
    throw new Error(`Sorry ${username}, but you are not on the amazing Tuesday team`);
  }
};
