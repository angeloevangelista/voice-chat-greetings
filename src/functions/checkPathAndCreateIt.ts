import fs from "fs";

async function checkPathAndCreateIt(path: string): Promise<void> {
  if (!fs.existsSync(path)) await fs.promises.mkdir(path);
}

export { checkPathAndCreateIt };
