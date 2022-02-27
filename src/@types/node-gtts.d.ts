declare module "node-gtts" {
  function Text2Speech(
    language: string,
    debug: boolean = false
  ): {
    tokenize: null;
    createServer: null;
    stream: null;
    save: (
      getArgs: any,
      filepath: string,
      text: string,
      callback: VoidFunction
    ) => void;
  };

  export { Text2Speech, Languages };
}
