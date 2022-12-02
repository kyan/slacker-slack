import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { FetchAndSendDataFunction } from "../functions/fetch_and_send_data/definition.ts";
import { format } from "datetime";

export const WhoForgotToLogTimeWorkflow = DefineWorkflow({
  callback_id: "check_slacker",
  title: "Who's forgot log time",
  description: "Checks to see who was available but forgot to log time",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

const formData = WhoForgotToLogTimeWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Who's forgot log time",
    interactivity: WhoForgotToLogTimeWorkflow.inputs.interactivity,
    submit_label: "Submit",
    description:
      "Enter a date for when you would like to check and also who you would like send the results to.",
    fields: {
      required: ["recipient", "start_date"],
      elements: [
        {
          name: "recipient",
          title: "Recipient",
          type: Schema.slack.types.user_id,
        },
        {
          name: "start_date",
          title: "Start date",
          type: "slack#/types/date",
          default: format(new Date(), "yyyy-MM-dd"),
        },
        {
          name: "end_date",
          title: "End date",
          type: "slack#/types/date",
          default: format(new Date(), "yyyy-MM-dd"),
        },
      ],
    },
  },
);

WhoForgotToLogTimeWorkflow.addStep(FetchAndSendDataFunction, {
  interactivity: formData.outputs.interactivity,
  recipient: formData.outputs.fields.recipient,
  start_date: formData.outputs.fields.start_date,
  end_date: formData.outputs.fields.end_date,
});
