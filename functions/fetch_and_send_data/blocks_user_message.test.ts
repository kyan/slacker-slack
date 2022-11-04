import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import blocksUserMessage from "./blocks_user_message.ts";

Deno.test("blocksUserMessage generates valid blocks for date", () => {
  const expectedBlocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "Hey Duncan :wave-animated: It looks like you've forgot to log time for *Sat Nov 05 2022*, please check you are up-to-date.\n\n<https://kyan.harvestapp.com/time/day/2022/11/05|View in Harvest>",
      },
    },
  ];

  assertEquals(blocksUserMessage("Duncan", "2022-11-05"), expectedBlocks);
});
