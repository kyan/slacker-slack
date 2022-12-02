import { User } from "./mod.ts";
import { NOTIFY_ID } from "./constants.ts";
import { ApiResults } from "../users.ts";
import { parse } from "datetime";

function dateBlocks(date: string, users: User[]) {
  const userBlocks = users.map(
    (user: User) => {
      const accessory = {
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: `Notify ${user.first_name}!`,
          },
          action_id: NOTIFY_ID,
          value: `${user.slackID}@${user.first_name}`,
        },
      };

      return {
        block_id: `user_${
          date.replace(" ", "").toLowerCase()
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
          "text": `*${date}*`,
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

  return dateKeys.sort().map((k) => {
    const dateFormatted = parse(k, "yyyy-MM-dd").toDateString();
    const blocks = dateBlocks(dateFormatted, apiData[k].users);
    return blocks;
  });
}
