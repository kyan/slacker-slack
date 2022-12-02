import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import blocksNotified from "./blocks_notified.ts";

Deno.test("blocksNotified generates valid blocks for date", () => {
  const expectedBlocks = [
    {
      type: "context",
      elements: [{
        type: "mrkdwn",
        text: "*Message sent, <@UABC123> has been notified about date!*",
      }],
    },
  ];

  assertEquals(blocksNotified("UABC123", "date"), expectedBlocks);
});
