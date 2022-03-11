import fs from "fs";
import path from "path";
import axios from "axios";
import crypto from "crypto";

/**
 * Return audio file path with the message
 *
 * @param message message to be converted
 * @returns path to audio file
 */
async function saveMessageToAudioFile(message: string): Promise<string> {
  const tempFolder = process.env.TEMP_FOLDER;
  const hash = crypto.randomBytes(8).toString("hex");
  const filePath = path.resolve(__dirname, tempFolder, `${hash}.mp3`);

  const { data } = await axios.get(
    "https://translate.google.com/translate_tts",
    {
      params: {
        ie: "UTF-8",
        tl: "pt-BR",
        client: "tw-ob",
        q: message,
      },
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "audio/wav",
      },
    }
  );

  await fs.promises.writeFile(filePath, data);

  return filePath;
}

export { saveMessageToAudioFile };
