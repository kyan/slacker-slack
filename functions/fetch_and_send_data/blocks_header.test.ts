import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import blocksHeader from "./blocks_header.ts";

Deno.test("blocksHeader generates valid blocks for date", () => {
  const expectedBlocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "The following people were booked in to be working and haven’t logged any time.\n\n *Check date: DATE*",
      },
    },
    { type: "divider" },
  ];

  assertEquals(blocksHeader("DATE"), expectedBlocks);
});
