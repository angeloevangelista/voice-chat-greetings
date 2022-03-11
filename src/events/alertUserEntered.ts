import { VoiceChannel, VoiceState, GuildMember, Client } from "discord.js";

import { saveMessageToAudioFile } from "../functions/saveMessageToAudioFile";
import { removeFile } from "../functions/removeFile";
import { checkPathAndCreateIt } from "../functions/checkPathAndCreateIt";
import { checkContinueFlowToAlertNewUser } from "../functions/checkContinueFlowToAlertNewUser";

function alertUserEntered(client: Client) {
  return async (previousState: VoiceState, nextState: VoiceState) => {
    const continueFlow = await checkContinueFlowToAlertNewUser(
      client,
      previousState,
      nextState
    );

    if (!continueFlow) return;

    const tempFolder = process.env.TEMP_FOLDER;
    const voiceConnection = await nextState.channel?.join();

    const {
      user: { username },
    } = nextState.member as GuildMember;

    const channel = client.channels.cache.get(
      <string>nextState.channelID
    ) as VoiceChannel;

    if (!channel) return;

    await checkPathAndCreateIt(tempFolder);

    const message = `${username} entrou`;

    const audioPath = await saveMessageToAudioFile(message);

    const completeCallback = async () => {
      await removeFile(audioPath);
      voiceConnection?.disconnect();
    };

    voiceConnection
      ?.play(audioPath)
      .on("finish", completeCallback)
      .on("close", completeCallback)
      .on("error", completeCallback)
      .on("end", completeCallback);
  };
}

export { alertUserEntered };
