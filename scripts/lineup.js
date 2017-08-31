import GoogleSpreadsheet from 'google-spreadsheet'


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

export const buildLineupMessage = lineup =>
  lineup.map(buildLineupPlayerMessage).join('\n')

export const buildLineupPlayerMessage = player =>
  `*${player.order} - ${player.name}* - `
  + player.innings.map(x => x || '-' ).join(',')
