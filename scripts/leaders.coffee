
Promise = require 'bluebird'
fs = Promise.promisifyAll(require 'fs')
csv = Promise.promisifyAll(require 'fast-csv')

module.exports.getMessage = (msg) ->
  stat = msg.message.text.split(' ')[1].toUpperCase()
  return false unless stat

  module.exports.getLeaders(stat)
  .then (result) ->
    response = '*Stat: ' + stat + '*'
    for i of result
      rank = parseInt(i) + parseInt(1)
      response += "\n " + rank + ". " + result[i].Name + " - " + result[i][stat]

    response

module.exports.getLeaders = (stat) ->
  new Promise (resolve, reject) ->
    stats = []
    stream = fs.createReadStream "./stats.csv"
    csv
      .fromStream(stream, headers: true)
      .on "data", (data) ->
        stats.push(data)
      .on "end", (data) ->
        return false unless stats[0][stat]
        sorted = stats.sort (a, b) ->
          parseFloat(b[stat]) - parseFloat(a[stat])
        sorted = sorted.slice(0,5)

        resolve sorted
