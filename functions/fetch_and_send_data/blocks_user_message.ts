import { parse } from "https://deno.land/std@0.160.0/datetime/mod.ts";

export default function blocksUserMessage(
  firstName: string,
  date: string,
  // deno-lint-ignore no-explicit-any
): any[] {
  const harvestLink = () =>
    `<https://kyan.harvestapp.com/time/day/${
      date.replaceAll("-", "/")
    }|View in Harvest>`;
  const checkDate = parse(date, "yyyy-MM-dd").toDateString();

  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          `Hey ${firstName} :wave-animated: It looks like you've forgot to log time for *${checkDate}*, please check you are up-to-date.\n\n${harvestLink()}`,
      },
    },
  ];
}
