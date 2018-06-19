import csv from "fast-csv";
import fs from "fs";
import _ from "lodash";
import { program } from "../util/fn";

export const getQuote = (type: string): Promise<string> =>
  program(
    getFileName,
    fetchQuote,
    formatQuote,
  )(type);

export const getFileName = (type: string): string =>
  type === "motivational"
    ? "./quotes.csv"
    : "./depressing-quotes.csv";

export const fetchQuote = (fileName: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const quotes = [];
    const stream = fs.createReadStream(fileName);
    return csv.fromStream(stream, {headers: false, delimiter: "/"})
      .on("data", (data) => quotes.push(data))
      .on("end", (data) => resolve(_.shuffle(quotes)[0]));
  });

export const formatQuote = (quote: string): string =>
  `${quote[0]} \n - *${quote[1]}*`;
