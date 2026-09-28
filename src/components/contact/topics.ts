export const contactTopicIds = ["general", "order", "wholesale", "corporate", "partnership", "press"] as const;

export type ContactTopic = (typeof contactTopicIds)[number];

export function isContactTopic(value: unknown): value is ContactTopic {
  return typeof value === "string" && (contactTopicIds as readonly string[]).includes(value);
}
