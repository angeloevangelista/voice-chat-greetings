import "dotenv/config";

import fs from "fs";
import crypto from "crypto";
import DiscordJs, { VoiceChannel } from "discord.js";
import textToMp3 from "./text-to-mp3";

const client = new DiscordJs.Client({});

client.on("ready", async () => {});

client.on("messageCreate", async (message) => {
  if (message.author.id === client.user?.id) {
    return;
  }

  await message.channel.send(message.content.split("").reverse().join(""));
});

client.on("voiceStateUpdate", async (previousState, nextState) => {
  if (nextState.member?.user.id === client.user?.id) {
    return;
  }

  const newUser = previousState.channelID !== nextState.channelID;

  if (!newUser) return;

  const voiceConnection = await nextState.channel?.join();

  const {
    user: { username },
  } = nextState.member as DiscordJs.GuildMember;

  const channel = client.channels.cache.get(
    <string>nextState.channelID
  ) as VoiceChannel;

  if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");

  const message = `${username} acabou de entrar no canal ${channel.name}`;

  const filenameCode = crypto.randomBytes(8).toString("hex");

  try {
    await textToMp3.saveMP3(message, filenameCode, (a: any) =>
      console.log({ a })
    );
  } finally {
    setTimeout(() => {
      if (fs.existsSync(`./temp/${filenameCode}.mp3`)) {
        voiceConnection
          ?.play(`./temp/${filenameCode}.mp3`)
          .on("finish", () => {
            fs.unlinkSync(`./temp/${filenameCode}.mp3`);
          })
          .on("error", () => {
            fs.unlinkSync(`./temp/${filenameCode}.mp3`);
          });
      } else {
        console.error("An error occurred while saving file.");
      }
    }, 1000);
  }
});

client.login(process.env.BOT_TOKEN).then(() => {
  console.log("BOT is running.");
});
