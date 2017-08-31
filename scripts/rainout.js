import jsdom from 'jsdom'


export const getRainoutMessage = () =>
  fetchRainoutMessage()
  .then(parseRainoutMessage)

export const parseRainoutMessage = text =>
  text === 'Questionable'
    ? text += ' :neutral_face:'
    : text === 'Canceled'
      ? text += ' :cry:'
      : text += ' :smile:'

export const fetchRainoutMessage = () =>
  new Promise((resolve, reject) =>
    jsdom.env(
      "http://rainoutline.com/search/extension/4122127246/60",
      ["http://code.jquery.com/jquery.js"],
      (err, window) =>
        err
          ? reject(err)
          : resolve(window.$(".gridcell7 span[class*=status]").text())
    )
  )
