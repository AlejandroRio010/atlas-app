import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { atlasUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }

  const emailNorm = email.toLowerCase().trim();

  const [existing] = await db
    .select({ id: atlasUsers.id })
    .from(atlasUsers)
    .where(eq(atlasUsers.email, emailNorm))
    .limit(1);

  if (existing) {
    return NextResponse.json({ error: "Email ya registrado" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);

  await db.insert(atlasUsers).values({
    email: emailNorm,
    password: hashed,
    name: name.trim(),
  });

  return NextResponse.json({ ok: true });
}
