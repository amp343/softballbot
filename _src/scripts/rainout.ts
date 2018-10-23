import * as jsdom from "jsdom";
import { IRainoutResponseJson } from "../types";
import { program } from "../util/fn";

export const getRainoutMessage = (url: string): string =>
  program(
    assertRainoutLine,
    fetchRainoutJson,
    rainoutJsonToMessage,
  )(url);

export const rainoutJsonToMessage = (r: IRainoutResponseJson) =>
  `${getStatusMsg(r.status)} (${r.updatedMsg})`;

export const getStatusMsg = (s: string): string =>
  s === "Questionable"
    ? s += " :neutral_face:"
    : s === "Canceled"
      ? s += " :cry:"
      : s += " :smile:";

export const fetchRainoutJson = (url: string): Promise<IRainoutResponseJson> =>
  new Promise((resolve, reject) =>
    jsdom.env(url, ["http://code.jquery.com/jquery.js"], (err, window) =>
      err
        ? reject(err)
        : resolve({
          status: window.$(".gridcell7 span[class*=status]").text(),
          updatedMsg: window.$(".gridcell7 strong").text(),
        }),
    ),
  );

export const assertRainoutLine = (url: string | null): string => {
  if (!url) {
    throw new Error("PSL Rainout line is not yet active");
  }
  return url;
};
