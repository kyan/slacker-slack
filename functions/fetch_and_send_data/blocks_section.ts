import { User } from "./mod.ts";
import { NOTIFY_ID } from "./constants.ts";
import { ApiResults } from "../users.ts";
import { parse } from "datetime";

function dateBlocks(dateString: string, users: User[]) {
  const dateFormatted = parse(dateString, "yyyy-MM-dd").toDateString();
  const userBlocks = users.map(
    (user: User) => {
      const data = {
        dateString,
        slack_id: user.slackID,
        first_name: user.first_name,
      };
      const accessory = {
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: `Notify ${user.first_name}!`,
          },
          action_id: NOTIFY_ID,
          value: JSON.stringify(data),
        },
      };

      return {
        block_id: `user_${
          dateFormatted.replace(" ", "").toLowerCase()
        }_block_${user.slackID}`,
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${user.first_name} ${user.last_name}* <@${user.slackID}>`,
        },
        ...(user.slackID ? accessory : {}),
      };
    },
  );

  return [
    {
      "type": "context",
      "elements": [
        {
          "text": `*${dateFormatted}*`,
          "type": "mrkdwn",
        },
      ],
    },
    {
      "type": "divider",
    },
    ...userBlocks,
    {
      "type": "divider",
    },
  ];
}

export default function blocksSection(
  apiData: ApiResults,
  // deno-lint-ignore no-explicit-any
): any[] {
  const dateKeys = Object.keys(apiData);

  return dateKeys.sort().map((dateStr) => {
    const blocks = dateBlocks(dateStr, apiData[dateStr].users);
    return blocks;
  });
}
