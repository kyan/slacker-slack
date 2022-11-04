// deno-lint-ignore no-explicit-any
export default function blocksHeader(startDate: string): any[] {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          `The following people were booked in to be working and haven’t logged any time.\n\n *Check date: ${startDate}*`,
      },
    },
    {
      type: "divider",
    },
  ];
}
