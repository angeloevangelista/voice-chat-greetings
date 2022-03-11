declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      TEMP_FOLDER: string;
    }
  }
}

export {};
