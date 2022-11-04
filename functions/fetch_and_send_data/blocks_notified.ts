export default function blocksNotified(
  slackID: string,
  // deno-lint-ignore no-explicit-any
): any[] {
  return [
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `*Message sent, <@${slackID}> has been notified!*`,
        },
      ],
    },
  ];
}
