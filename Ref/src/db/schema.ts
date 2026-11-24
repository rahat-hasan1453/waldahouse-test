import { date, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Every enquiry that comes through the website — room requests, table
 * reservations, spa slots, events and whisky-shop appointments — lands here.
 */
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 32 }).notNull(), // room | table | event | spa | whisky
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 60 }),
  arrival: date("arrival"),
  departure: date("departure"),
  guests: integer("guests"),
  roomSlug: varchar("room_slug", { length: 80 }),
  message: text("message"),
  status: varchar("status", { length: 24 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const newsletter = pgTable("newsletter", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
