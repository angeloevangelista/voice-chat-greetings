import { Client, VoiceState } from "discord.js";

async function checkContinueFlowToAlertNewUser(
  client: Client,
  previousState: VoiceState,
  nextState: VoiceState
): Promise<boolean> {
  const isNotBotEntrance = nextState.member?.user.id !== client.user?.id;
  const isNewUserOnChat = previousState.channelID !== nextState.channelID;

  const isMoreThanOneUser =
    (nextState.channel?.members.map((p) => p.id).length || 0) > 1;

  return [isNotBotEntrance, isNewUserOnChat, isMoreThanOneUser].every(
    (condition) => condition
  );
}

export { checkContinueFlowToAlertNewUser };
