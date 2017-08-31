import _ from 'lodash'
import csv from 'fast-csv'
import fs from 'fs'


export const getFileName = type =>
  type === 'motivational'
    ? './quotes.csv'
    : './depressing-quotes.csv'

export const getQuote = type =>
  fetchQuote(getFileName(type))
  .then(result => writeQuote(result))

export const fetchQuote = file =>
  new Promise((resolve, reject) => {
    const quotes = []
    const stream = fs.createReadStream(file)
    return csv.fromStream(stream, {headers: false, delimiter: '/'})
      .on("data", data => quotes.push(data))
      .on("end", data => resolve(_.shuffle(quotes)[0]))
  })

export const writeQuote = quote =>
  quote[0] + ' \n - *' + quote[1] + '*'
