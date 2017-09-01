export const codeBlock = str =>
  str
    ? '```' + str + '```'
    : ''

export const valueOrEmpty = val =>
  val ? val : ''

export const valueOrDash = val =>
  val ? val : '-'

export const getMsgUser = msg =>
  Promise.resolve(msg.message.user)
