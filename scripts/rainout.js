import jsdom from 'jsdom'


export const getRainoutMessage = (rainoutUrl) =>
  fetchRainoutMessage(rainoutUrl)
  .then(parseRainoutMessage)

export const parseRainoutMessage = text =>
  text === 'Questionable'
    ? text += ' :neutral_face:'
    : text === 'Canceled'
      ? text += ' :cry:'
      : text += ' :smile:'

export const fetchRainoutMessage = (rainoutUrl) =>
  new Promise((resolve, reject) =>
    jsdom.env(rainoutUrl, ["http://code.jquery.com/jquery.js"], (err, window) =>
      err
        ? reject(err)
        : resolve(window.$(".gridcell7 span[class*=status]").text())
    )
  )
