import _ from 'lodash'
import GoogleSpreadsheet from 'google-spreadsheet'
import { Table, TableColumn } from './table'
import { valueOrDash } from './util'


export const getLineupTable = (ssKey, ssIdx, ssRange) =>
  fetchLineup(ssKey, ssIdx, ssRange)
  .then(parseLineup)
  .then(buildLineupTable)

export const getLineupMessage = (ssKey, ssIdx, ssRange) =>
  fetchLineup(ssKey, ssIdx, ssRange)
  .then(parseLineup)
  .then(buildLineupMessage)

export const fetchWorksheet = (ssKey, ssIdx, ssRange) =>
  new Promise((resolve, reject) =>
    new GoogleSpreadsheet(ssKey).getInfo((err, info) =>
      err
        ? reject(err)
        : info.worksheets[ssIdx].getRows((err, rows) =>
          err
            ? reject(err)
            : resolve(rows)
          )
    )
  )

export const fetchLineup = (ssKey, ssIdx, ssRange) =>
  fetchWorksheet(ssKey, ssIdx, ssRange)

export const parseLineup = lineup =>
  lineup.map(transformPerson)

export const transformPerson = person => ({
  order: person.order,
  name: person.name,
  innings: [
    person.inning1,
    person.inning2,
    person.inning3,
    person.inning4,
    person.inning5,
    person.inning6,
    person.inning7
  ]
})

export const buildTableColumns = lineup =>
  [
    new TableColumn('#', x => x.order),
    new TableColumn('Name', x => x.name),
    new TableColumn('Inn', x => null),
    new TableColumn('1', x => valueOrDash(x.innings[0])),
    new TableColumn('2', x => valueOrDash(x.innings[1])),
    new TableColumn('3', x => valueOrDash(x.innings[2])),
    new TableColumn('4', x => valueOrDash(x.innings[3])),
    new TableColumn('5', x => valueOrDash(x.innings[4])),
    new TableColumn('6', x => valueOrDash(x.innings[5])),
    new TableColumn('7', x => valueOrDash(x.innings[6])),
  ]

export const buildLineupTable = lineup =>
  new Table(buildTableColumns(lineup), lineup, '=', '').buildTableString()

export const buildLineupMessage = lineup =>
  lineup.map(player =>
    `*${player.order}* ${player.name}: ${player.innings.map(valueOrDash).join(', ')}`
  ).join('\n')
