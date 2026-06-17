export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/entrenamiento", "/api/atlas-state/:path*"],
};
