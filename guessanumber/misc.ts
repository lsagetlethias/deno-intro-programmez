export const enum App {
  HOST = "127.0.0.1",
  PORT = "8000",
  NAME = "guessanumber",
  DEFAULT_ROUTE = "/"
}

// "Failsafe" en cas de remise à zero impromptue
export const enum GuessSafeEnum {
  NAN = -1,
  RESET = -2
}

export function log(...data: any[]) {
  console.log(`${App.NAME}:`, ...data);
}

export const generate = () => Math.floor(Math.random() * 10);
