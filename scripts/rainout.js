import jsdom from 'jsdom'


export const getRainoutMessage = (rainoutUrl) =>
  fetchRainoutMessage(rainoutUrl)
  .then(({ status, updatedMsg }) => parseRainoutMessage(status, updatedMsg))

export const parseRainoutMessage = (text, updatedMsg) =>
  `${getStatusMsg(text)} (${updatedMsg})`

export const getStatusMsg = text =>
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
        : resolve({
          status: window.$(".gridcell7 span[class*=status]").text(),
          updatedMsg: window.$(".gridcell7 strong").text(),
        })
    )
  )
