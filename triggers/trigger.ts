import { Trigger } from "deno-slack-api/types.ts";

const trigger: Trigger = {
  type: "shortcut",
  name: "Who's forgot log time",
  description: "Check to see who was available but forgot to log time",
  workflow: "#/workflows/check_slacker",
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
  },
};

export default trigger;
