import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const atlasUsers = pgTable("atlas_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const atlasState = pgTable("atlas_state", {
  userId: uuid("user_id").primaryKey().references(() => atlasUsers.id, { onDelete: "cascade" }),
  state: jsonb("state").notNull().default({}),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});
