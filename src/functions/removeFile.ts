import fs from "fs";

async function removeFile(filePath: string): Promise<void> {
  if (fs.existsSync(filePath)) await fs.promises.unlink(filePath);
}

export { removeFile };
