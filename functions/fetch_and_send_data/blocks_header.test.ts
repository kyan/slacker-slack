import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import blocksHeader from "./blocks_header.ts";

Deno.test("blocksHeader generates valid blocks for date", () => {
  const expectedBlocks = [
    {
      elements: [
        {
          text:
            "The following people were booked in to be working and haven’t logged any time.",
          type: "mrkdwn",
        },
      ],
      type: "context",
    },
    {
      type: "divider",
    },
  ];

  assertEquals(blocksHeader(), expectedBlocks);
});
