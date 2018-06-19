import R from "ramda";
import { IRobot } from "../types";

export const robotBrainGet = R.curry((robot: IRobot, key: string): Promise<any> => {
  try {
    return Promise.resolve(robot.brain.get(key));
  } catch (err) {
    return Promise.reject(err);
  }
});

export const robotBrainSet = R.curry((robot: IRobot, key: string, val: any): Promise<any> => {
  try {
    return Promise.resolve(robot.brain.set(key, val));
  } catch (err) {
    return Promise.reject(err);
  }
});
