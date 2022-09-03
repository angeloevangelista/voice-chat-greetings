import "dotenv/config";
import { Client } from "discord.js";

import "./api";

import { alertUserEntered } from "./events/alertUserEntered";

const client = new Client({});

client.on("voiceStateUpdate", alertUserEntered(client));

client.login(process.env.BOT_TOKEN).then(() => console.log("BOT is running."));
