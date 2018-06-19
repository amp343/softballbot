import _ from 'lodash'
import GoogleSpreadsheet from 'google-spreadsheet'
import { Table, TableColumn } from './table'
import { valueOrDash } from './util'


export const getLineupTable = (ssKey, ssIdx, tableOpts = {}) =>
  fetchLineup(ssKey, ssIdx)
  .then(parseLineup)
  .then(lineup => buildLineupTable(lineup, tableOpts))

export const getLineupMessage = (ssKey, ssIdx) =>
  fetchLineup(ssKey, ssIdx)
  .then(parseLineup)
  .then(buildLineupMessage)

export const fetchWorksheet = (ssKey, ssIdx) =>
  new Promise((resolve, reject) =>
    new GoogleSpreadsheet(ssKey).getInfo((err, info) => {
      if (err) {
        reject(err)
      }
      return info.worksheets[ssIdx].getRows((err, rows) =>
        err
          ? reject(err)
          : resolve(rows)
      )
    })
  )

export const fetchLineup = (ssKey, ssIdx) =>
  fetchWorksheet(ssKey, ssIdx)

export const parseLineup = lineup =>
  shouldPublish(lineup)
    ? lineup.map(transformPerson)
    : []

export const shouldPublish = lineup =>
  lineup[0].publish === 'TRUE'

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

export const buildLineupTable = (lineup, tableOpts = {}) =>
  new Table(buildTableColumns(lineup), lineup, tableOpts).buildTableString()

export const buildLineupMessage = lineup =>
  lineup.length > 0
    ? lineup.map(player =>
      `*${player.order}* ${player.name}: ${player.innings.map(valueOrDash).join(', ')}`
    ).join('\n')
    : 'Lineup not yet set'
