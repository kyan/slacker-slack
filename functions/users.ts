import { User } from "./fetch_and_send_data/mod.ts";

interface SlackMember {
  id: string;
  is_bot: boolean;
  deleted: boolean;
  is_restricted: boolean;
  profile: {
    first_name: string;
    last_name: string;
    real_name_normalized: string;
  };
}

export interface ApiResults {
  [index: string]: {
    users: User[];
  };
}

function addSlackID(apiResults: ApiResults, members: SlackMember[]) {
  const dateKeys = Object.keys(apiResults);

  dateKeys.forEach((k) => {
    const lookup = apiResults[k];

    const results = [
      ...lookup.users.map((user) => {
        const slackMember = members.find((m) => {
          return (m.profile.first_name === user.first_name &&
            m.profile.last_name === user.last_name) ||
            m.profile.last_name === user.last_name ||
            m.profile?.real_name_normalized?.toLowerCase() ===
              `${user.first_name} ${user.last_name}`.toLowerCase();
        });
        user.slackID = slackMember?.id;

        return user;
      }),
    ];

    lookup.users = results;
  });
}

async function fetchData(url: URL, token: string): Promise<ApiResults> {
  const options = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  };
  const dataRequest = new Request(url, options);
  const response = await fetch(dataRequest);
  const json = await response.json();

  if (response.status !== 200) {
    throw new Error(json.message);
  }

  return json.dates;
}

// deno-lint-ignore no-explicit-any
async function slackMembers(client: any) {
  const slackUsers = await client.apiCall("users.list", {
    team_id: "T024ZGW0Q",
  });

  return slackUsers.members.filter((user: SlackMember) => (
    !user.is_bot && !user.deleted && !user.is_restricted
  ));
}

export async function fetchUsers(
  // deno-lint-ignore no-explicit-any
  client: any,
  apiUrl: string,
  apiToken: string,
  startDate: string,
  endDate: string,
) {
  const url = new URL(apiUrl);
  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", endDate);

  const datesObject = await fetchData(url, apiToken);
  const slackUsers = await slackMembers(client);

  addSlackID(datesObject, slackUsers);

  return datesObject;
}
