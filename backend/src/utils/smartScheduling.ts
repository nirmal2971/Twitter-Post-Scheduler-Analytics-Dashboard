import { DateTime } from "luxon";

export const suggestAlternativeTime = (scheduledAt: Date, userTimezone: string): Date => {
  const dt = DateTime.fromJSDate(scheduledAt).setZone(userTimezone);

  if (dt.hour >= 0 && dt.hour < 6) {
    return dt.set({ hour: 8, minute: 0 }).toJSDate();
  }

  return dt.toJSDate();
};
