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

  // Inject logout button before </body>
  const logoutBtn = `<div style="position:fixed;top:12px;right:12px;z-index:9999">
    <form action="/api/auth/signout" method="POST">
      <button type="submit" style="background:none;border:1px solid #333;color:#555;font-family:monospace;font-size:9px;letter-spacing:2px;padding:5px 8px;cursor:pointer">SALIR</button>
    </form>
  </div>`;
  html = html.replace("</body>", logoutBtn + "</body>");

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
