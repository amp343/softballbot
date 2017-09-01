export const robotBrainGet = (robot, key) =>
  new Promise((resolve, reject) => {
    try {
      resolve(robot.brain.get(key))
    } catch (err) {
      reject(err)
    }
  })

export const robotBrainSet = (robot, key, val) =>
  new Promise((resolve, reject) => {
    try {
      resolve(robot.brain.set(key, val))
    } catch (err) {
      reject(err)
    }
  })
