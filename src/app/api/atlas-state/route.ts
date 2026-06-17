import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { atlasState } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const [row] = await db
    .select()
    .from(atlasState)
    .where(eq(atlasState.userId, session.user.id))
    .limit(1);

  return NextResponse.json({ state: row?.state ?? null });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { state } = await req.json();
  const userId = session.user.id;

  await db
    .insert(atlasState)
    .values({ userId, state })
    .onConflictDoUpdate({
      target: atlasState.userId,
      set: { state, updatedAt: new Date() },
    });

  return NextResponse.json({ ok: true });
}
