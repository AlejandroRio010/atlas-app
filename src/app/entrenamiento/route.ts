import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";

export async function GET() {
  const session = await auth();
  if (!session) redirect("/login");

  const filePath = path.join(process.cwd(), "public", "atlas.html");
  let html = fs.readFileSync(filePath, "utf8");

  const name = session.user?.name ?? "Atleta";
  const email = session.user?.email ?? "";
  const userId = session.user?.id ?? "anon";
  const canLumbar = email === "alejandro.rio@begreatconsulting.es";
  html = html.replace("Alejandro · Atleta", `${name} · Atleta`);
  // Inject identity at top of <body> so it's available before any script runs
  // canLumbar is a boolean — the email itself never reaches the client
  html = html.replace("<body>", `<body><script>window.__atlasUserId=${JSON.stringify(userId)};window.__atlasUserEmail=${JSON.stringify(email)};window.__atlasUserName=${JSON.stringify(name)};window.__atlasCanLumbar=${canLumbar};</script>`);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
