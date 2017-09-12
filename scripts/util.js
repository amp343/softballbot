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

export const getMentionedUser = msg => {
  const match = msg.message.text.match(/@([\w\-\.]+)/)
  return match ? { name: match[1] } : null
}
