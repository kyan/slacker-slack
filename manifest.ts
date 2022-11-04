import { Manifest } from "deno-slack-sdk/mod.ts";
import { WhoForgotToLogTimeWorkflow } from "./workflows/WhoForgotToLogTimeWorkflow.ts";
import { FetchAndSendDataFunction } from "./functions/fetch_and_send_data/definition.ts";

export default Manifest({
  name: "doh",
  description: "Who's forgot log time",
  icon: "assets/icon.png",
  workflows: [WhoForgotToLogTimeWorkflow],
  functions: [FetchAndSendDataFunction],
  outgoingDomains: ["kyan-slacker.deno.dev"],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "users:read",
  ],
});
