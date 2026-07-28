import { pgTable, serial, text, timestamp, varchar, integer, jsonb } from "drizzle-orm/pg-core";

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  face_descriptor: jsonb("face_descriptor").notNull().$type<number[]>(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const attendanceLogs = pgTable("attendance_logs", {
  id: serial("id").primaryKey(),
  employee_id: integer("employee_id").references(() => employees.id).notNull(),
  name: text("name").notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
