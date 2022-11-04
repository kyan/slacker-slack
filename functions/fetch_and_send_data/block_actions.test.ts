import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";
import { stub } from "https://deno.land/std@0.162.0/testing/mock.ts";
import handler from "./block_actions.ts";
import { NOTIFY_ID } from "./constants.ts";

// Replaces globalThis.fetch with the mocked copy
mf.install();

mf.mock("POST@/api/chat.postMessage", async (req) => {
  const body = await req.formData();
  if (body.get("channel")?.toString() !== "U11111") {
    return new Response(`{"ok": false, "error": "unexpected channel ID"}`, {
      status: 200,
    });
  }
  return new Response(`{"ok": true, "message": {"ts": "111.222"}}`, {
    status: 200,
  });
});
mf.mock("POST@/api/chat.update", () => {
  return new Response(`{"ok": true, "message": {"ts": "111.222"}}`, {
    status: 200,
  });
});
mf.mock("POST@/api/functions.completeSuccess", () => {
  return new Response(`{"ok": true}`, {
    status: 200,
  });
});

Deno.test("FetchAndSendDataFunction runs successfully", async () => {
  stub(console, "log");

  const context = {
    action: {
      value: "U11111@Duncan",
      block_id: "no-used",
      action_id: NOTIFY_ID,
      style: "primary",
      type: "button",
      text: {
        type: "plain_text",
        text: "Example",
        emoji: true,
      },
      action_ts: "1664342569.823796",
    },
    body: {
      message: {
        blocks: [{
          block_id: "random123",
        }, {
          block_id: "user_block_U11111",
        }],
      },
      container: {
        channel_id: "C11111",
        message_ts: "abc123",
      },
      function_data: {
        inputs: {
          employee: "U11111",
          manager: "U22222",
          start_date: "2022-03-01",
          interactivity: {
            interactivity_pointer: "111.222.b79....",
            interactor: {
              id: "U33333",
              secret: "NDE0NTIxNDg....",
            },
          },
        },
      },
    },
    env: { LOG_LEVEL: "ERROR" },
    token: "valid-token",
    // deno-lint-ignore no-explicit-any
  } as any;
  await handler(context);
});
