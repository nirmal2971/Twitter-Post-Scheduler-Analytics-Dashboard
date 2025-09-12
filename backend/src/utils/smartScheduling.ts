import { DateTime } from "luxon";

// Suggests an alternative time if conflict exists
export const suggestAlternativeTime = (scheduledAt: Date, userTimezone: string): Date => {
  const dt = DateTime.fromJSDate(scheduledAt).setZone(userTimezone);

  // Example: if time is between 00:00-06:00, move to 08:00
  if (dt.hour >= 0 && dt.hour < 6) {
    return dt.set({ hour: 8, minute: 0 }).toJSDate();
  }

  return dt.toJSDate();
};
