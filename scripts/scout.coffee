
Promise = require 'bluebird'
jsdom = require 'jsdom'

module.exports.getMessage = (msg) ->
  opponentName = module.exports.getOpponentName msg
  nwName = 'Nowait'

  module.exports.buildScoutingReport(opponentName, nwName)
  .spread (opponentReport, nwReport) ->
    module.exports.getScoutingReportVs(opponentReport, nwReport)


module.exports.getOpponentName = (msg) ->
  msg.message.text.split(' ').map((word) ->
    word[0].toUpperCase() + word.substr(1)
  ).slice(1).join(' ')


module.exports.buildScoutingReport = (opponentName, nwName) ->
  reports = []
  reports.push module.exports.fetchScoutingReportRow(opponentName)
  reports.push module.exports.fetchScoutingReportRow(nwName)

  Promise.all(reports)
  .spread (opponentRow, nwRow) ->
    [
      module.exports.getScoutingReport(opponentRow),
      module.exports.getScoutingReport(nwRow)
    ]


module.exports.fetchScoutingReportRow = (name) ->
  new Promise (resolve, reject) ->
    url = "http://pittsburghsportsleague.leagueapps.com/leagues/87696/standings"
    jsdom.env url, ["http://code.jquery.com/jquery.js"], (err, window) ->
      table = window.$("table.standings")
      row = table.find('td.team:contains(' + name + ')').closest('tr')
      resolve row


module.exports.getScoutingReport = (row) ->
  return {
    name: row.find('td').eq(0).text()
    standing: (row.index() + 1) + '/' + (row.closest('table').find('tr').size() - 1)
    games: row.find('td').eq(1).text()
    wins: row.find('td').eq(2).text()
    losses: row.find('td').eq(3).text()
    ties: row.find('td').eq(4).text()
    runsFor: row.find('td').eq(5).text()
    runsAllowed: row.find('td').eq(6).text()
    runsDifferential: row.find('td').eq(7).text()
  }


module.exports.getScoutingReportText = (report) ->
  "\n" +
  "\n*Team:* " + report.name +
  "\n*Standing:* " + report.standing +
  "\n*Record:* " + report.wins + '-' + report.losses + '-' + report.ties +
  "\n*Run differential:* " + report.runsDifferential


module.exports.getScoutingReportVs = (reportA, reportB) ->
  "\nHere is the scouting report for " +
  reportA.name + " vs. " + reportB.name + "\n" +
  "\n" + module.exports.getScoutingReportText(reportA) +
  "\n-----------------------------" +
  "\n ... vs ..." +
  "\n-----------------------------" +
  module.exports.getScoutingReportText(reportB) +
  "\n-----------------------------" +
  module.exports.getPredictionText(reportA, reportB)


module.exports.getPredictionText = (reportA, reportB) ->
  # nowait should be reportB
  '\n*Prediction! - * I think the valiant Nowait team has a *' +
  module.exports.getNwOdds(reportA, reportB) +
  '%* chance of winning this game'


module.exports.getNwOdds = (reportA, reportB) ->
  expRf = ((parseInt(reportA.runsAllowed) / parseInt(reportA.games)) +
  (parseInt(reportB.runsFor) + parseInt(reportB.games))) / 2

  expRfStd = expRf / 4

  expRa = ((parseInt(reportA.runsFor) / parseInt(reportA.games)) +
  (parseInt(reportB.runsAllowed) + parseInt(reportB.games))) / 2

  expRaStd = expRa / 4

  expRd = expRf - expRa

  odds = (.5 + ((expRd / expRfStd) * .16)).toFixed(2) * 100
  odds = if odds < 0 then 0 else odds
