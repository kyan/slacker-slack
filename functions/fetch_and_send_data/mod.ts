import { parse } from "datetime";
import { FetchAndSendDataFunction } from "./definition.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";
import BlockActionHandler from "./block_actions.ts";
import blocksHeader from "./blocks_header.ts";
import blocksSection from "./blocks_section.ts";
import { NOTIFY_ID } from "./constants.ts";
import { fetchUsers } from "../users.ts";

interface Absence {
  date: string;
  userId: number;
  startType: string;
  endType: string;
  reason: string;
  status: string;
  leaveType: string;
}

interface HarvestTimeEntry {
  spent_date: string;
  hours: number;
  notes: string;
  user: {
    id: number;
    name: string;
  };
}

export interface User {
  needsReminding: boolean;
  email: string;
  timetastic_id?: number;
  harvest_id?: number;
  slackID?: string;
  first_name: string;
  last_name: string;
  absence?: Absence;
  timeEntry?: HarvestTimeEntry;
}

export default SlackFunction(
  FetchAndSendDataFunction,
  async ({ inputs, token, env }) => {
    console.log("Forwarding the Slacker check:", inputs);

    const startDateFormatted = parse(inputs.start_date, "yyyy-MM-dd")
      .toDateString();
    const endDateFormatted = parse(inputs.end_date, "yyyy-MM-dd")
      .toDateString();
    const apiUrl = env.API_URL;
    const apiToken = env.API_TOKEN;
    const client = SlackAPI(token, {});

    try {
      const apiData = await fetchUsers(
        client,
        apiUrl,
        apiToken,
        inputs.start_date,
        inputs.end_date,
      );
      const blocks = blocksHeader()
        .concat(...blocksSection(apiData));

      const msgResponse = await client.chat.postMessage({
        channel: inputs.recipient,
        blocks,
        text:
          `A new timesheet check has been generated between *${startDateFormatted}* and *${endDateFormatted}*`,
      });

      if (!msgResponse.ok) {
        console.log(
          "Error during request chat.postMessage!",
          msgResponse.error,
        );
      }
    } catch (e) {
      return { completed: true, error: e.message };
    }

    return {
      completed: false,
    };
  },
  // Create an 'actions router' which is a helper utility to route interactions
  // with different interactive Block Kit elements (like buttons!)
).addBlockActionsHandler(
  // listen for interactions with components with the following action_ids
  [NOTIFY_ID],
  // interactions with the above components get handled by the function below
  BlockActionHandler,
);
