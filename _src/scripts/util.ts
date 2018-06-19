import { valueOr } from "../util/fn";

export const codeBlock = (s: string): string =>
  s ? "```" + s + "```" : "";

export const valueOrEmpty = (val: string): string => valueOr(val, " ");

export const valueOrDash = (val: string): string => valueOr(val, "-");
