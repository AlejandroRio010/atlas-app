import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";

export async function GET() {
  const session = await auth();
  if (!session) redirect("/login");

  const filePath = path.join(process.cwd(), "public", "atlas.html");
  let html = fs.readFileSync(filePath, "utf8");

  // Replace the name shown in the header
  const name = (session.user?.name ?? "Atleta").toUpperCase();
  html = html.replace("ALEJANDRO · ATLETA", `${name} · ATLETA`);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
