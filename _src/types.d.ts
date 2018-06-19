export interface IObj {
  [key: string]: any;
}

export interface IWeatherResult extends IObj {
  precipProbability: string;
  summary: string;
  temperature: number;
}

export interface IFormattedWeatherResult {
  precipProbability: string;
  summary: string;
  temperature: string;
  time: string;
}

export interface IWeatherResponseJson {
  hourly: {
    data: IWeatherResult[];
  }
}

export interface IRobot extends IObj {
  brain: {
    get: (k: string) => any,
    set: (k: string, v: any) => any
  }
}

export interface IRainoutResponseJson {
  status: string;
  updatedMsg: string;
}

export interface IUserObj extends IObj{
  name: string;
}

export interface IMsgObj extends IObj {

}
