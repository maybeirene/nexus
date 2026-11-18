export type WeatherKind = "clear" | "partly-cloudy" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "storm";

export type CurrentWeather = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  code: number;
};

export type DailyForecast = {
  date: Date;
  max: number;
  min: number;
  code: number;
};

export type Weather = {
  current: CurrentWeather;
  forecast: DailyForecast[];
};

export type Location = {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export const MADRID: Location = {
  name: "Madrid",
  latitude: 40.4168,
  longitude: -3.7038,
  timezone: "Europe/Madrid",
};
