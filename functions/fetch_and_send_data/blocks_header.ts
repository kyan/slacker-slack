// deno-lint-ignore no-explicit-any
export default function blocksHeader(): any[] {
  return [
    {
      "type": "context",
      "elements": [
        {
          "text":
            "The following people were booked in to be working and haven’t logged any time.",
          "type": "mrkdwn",
        },
      ],
    },
    {
      "type": "divider",
    },
  ];
}
