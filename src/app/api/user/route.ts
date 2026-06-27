import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { atlasUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { name, email, currentPassword, newPassword } = await req.json();

  const [user] = await db.select().from(atlasUsers).where(eq(atlasUsers.id, session.user.id)).limit(1);
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  const updates: Record<string, string> = {};

  if (name?.trim()) updates.name = name.trim();

  if (email?.trim() && email !== user.email) {
    const norm = email.toLowerCase().trim();
    const [existing] = await db.select({ id: atlasUsers.id }).from(atlasUsers).where(eq(atlasUsers.email, norm)).limit(1);
    if (existing) return NextResponse.json({ error: "Email ya en uso" }, { status: 409 });
    updates.email = norm;
  }

  if (newPassword) {
    if (!currentPassword) return NextResponse.json({ error: "Introduce tu contraseña actual" }, { status: 400 });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 400 });
    updates.password = await bcrypt.hash(newPassword, 12);
  }

  if (Object.keys(updates).length === 0) return NextResponse.json({ ok: true });

  await db.update(atlasUsers).set(updates).where(eq(atlasUsers.id, session.user.id));

  return NextResponse.json({ ok: true });
}
