import { SlackAPI } from "deno-slack-api/mod.ts";
import { FetchAndSendDataFunction } from "./definition.ts";
import { BlockActionHandler } from "deno-slack-sdk/types.ts";
import blocksUserMessage from "./blocks_user_message.ts";
import blocksNotified from "./blocks_notified.ts";
import { parse } from "datetime";

const block_actions: BlockActionHandler<
  typeof FetchAndSendDataFunction.definition
> = async function ({ action, body, token }) {
  console.log("Incoming action handler invocation", action);
  const client = SlackAPI(token);
  const data = JSON.parse(action.value);
  const dateFormatted = parse(data.dateString, "yyyy-MM-dd").toDateString();

  const msgResponse = await client.chat.postMessage({
    channel: data.slack_id,
    blocks: blocksUserMessage(data.first_name, data.dateString),
    text: `:wave:, it looks like you forgot to log time for ${dateFormatted}.`,
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
    block.block_id === `user_block_${data.slack_id}`
  );
  if (userIndex) userBlocks.splice(userIndex, 1);

  const msgUpdate = await client.chat.update({
    channel: body.container.channel_id,
    ts: body.container.message_ts,
    blocks: userBlocks.concat(blocksNotified(data.slack_id, dateFormatted)),
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
