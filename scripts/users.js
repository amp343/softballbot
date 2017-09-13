import { getConfig } from './config'

export const getAllUsers = () =>
  getConfig('users')

export const atUser = username =>
  username[0] !== '@' ? `@${username}` : username
