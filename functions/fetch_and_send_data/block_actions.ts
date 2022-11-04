import { SlackAPI } from "deno-slack-api/mod.ts";
import { FetchAndSendDataFunction } from "./definition.ts";
import { BlockActionHandler } from "deno-slack-sdk/types.ts";
import blocksUserMessage from "./blocks_user_message.ts";
import blocksNotified from "./blocks_notified.ts";

const block_actions: BlockActionHandler<
  typeof FetchAndSendDataFunction.definition
> = async function ({ action, body, token }) {
  console.log("Incoming action handler invocation", action);
  const client = SlackAPI(token);
  const startDate = body.function_data.inputs.start_date;
  const [slackID, firstName] = action.value.split("@");

  const msgResponse = await client.chat.postMessage({
    channel: slackID,
    blocks: blocksUserMessage(firstName, startDate),
    text: `:wave:, it looks like you forgot to log time for ${startDate}.`,
  });

  if (!msgResponse.ok) {
    console.log(
      "Error during requester update chat.postMessage!",
      msgResponse.error,
    );
  }

  const userBlocks = body.message?.blocks;
  if (!userBlocks) return;

  // deno-lint-ignore no-explicit-any
  const userIndex = userBlocks.findIndex((block: any) =>
    block.block_id === `user_block_${slackID}`
  );
  if (userIndex) userBlocks.splice(userIndex, 1);

  const msgUpdate = await client.chat.update({
    channel: body.container.channel_id,
    ts: body.container.message_ts,
    blocks: userBlocks.concat(blocksNotified(slackID)),
  });
  if (!msgUpdate.ok) {
    console.log("Error during manager chat.update!", msgUpdate.error);
  }

  if (userBlocks.length < 1) {
    // And now we can mark the function as 'completed' - which is required as
    // we explicitly marked it as incomplete in the main function handler.
    await client.functions.completeSuccess({
      function_execution_id: body.function_data.execution_id,
      outputs: {},
    });
  }
};

export default block_actions;
