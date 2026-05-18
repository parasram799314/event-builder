import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const websites = pgTable("websites", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  theme: text("theme").default("barfi"),
  status: text("status").default("draft"),
  eventDate: timestamp("event_date"),
  eventTime: text("event_time"),
  endDate: timestamp("end_date"),
  endTime: text("end_time"),
  content: jsonb("content"), // Stores the website layout/sections
  lastModifiedBy: text("last_modified_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
