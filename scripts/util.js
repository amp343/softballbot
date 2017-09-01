export const codeBlock = str =>
  '```' + str + '```'

export const valueOrEmpty = val =>
  val ? val : ''

export const valueOrDash = val =>
  val ? val : '-'
