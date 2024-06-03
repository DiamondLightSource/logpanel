export enum LogLevel {
  EMERG = 0,
  ALERT = 1,
  CRITICAL = 2,
  ERROR = 3,
  WARN = 4,
  NOTICE = 5,
  INFO = 6,
  DEBUG = 7,
}

export function allLogLevels(): [string, number][] {
  // Typescript annoyance, there doesn't seem to be a nice solution
  // https://stackoverflow.com/questions/56044872/typescript-enum-object-values-return-value
  const entries = Object.entries(LogLevel);
  return entries.slice(entries.length / 2) as [string, number][];
}
