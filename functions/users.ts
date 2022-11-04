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

function addSlackID(slackers: User[], members: SlackMember[]) {
  slackers.forEach((sl) => {
    const slackMember = members.find((m) => {
      return (m.profile.first_name === sl.first_name &&
        m.profile.last_name === sl.last_name) ||
        m.profile.last_name === sl.last_name ||
        m.profile?.real_name_normalized?.toLowerCase() ===
          `${sl.first_name} ${sl.last_name}`.toLowerCase();
    });

    sl.slackID = slackMember?.id;
  });
}

async function fetchData(url: URL, token: string): Promise<User[]> {
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

  return json.users.filter((user: User) => user.needsReminding);
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
) {
  const url = new URL(apiUrl);
  url.searchParams.set("date", startDate);

  const users = await fetchData(url, apiToken);
  const slackUsers = await slackMembers(client);

  addSlackID(users, slackUsers);

  return users;
}
