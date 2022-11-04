import { User } from "./mod.ts";
import { NOTIFY_ID } from "./constants.ts";

// deno-lint-ignore no-explicit-any
export default function blocksUsers(users: User[]): any[] {
  return users.map(
    (user: User) => {
      const accessory = {
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            emoji: true,
            text: `Notify ${user.first_name}!`,
          },
          action_id: NOTIFY_ID,
          value: `${user.slackID}@${user.first_name}`,
        },
      };

      return {
        block_id: `user_block_${user.slackID}`,
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${user.first_name} ${user.last_name}*\n${user.email}`,
        },
        ...(user.slackID ? accessory : {}),
      };
    },
  );
}
