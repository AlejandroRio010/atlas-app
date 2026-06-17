"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (!res || res.error) {
        setError("Email o contraseña incorrectos.");
      } else {
        window.location.href = "/entrenamiento";
      }
    } catch (err) {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0d0d", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontFamily: "Impact, Arial Narrow, sans-serif", fontSize: "48px", letterSpacing: "4px", color: "#fff" }}>
            A<span style={{ color: "#ff4d1f" }}>·</span>TLAS
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "4px", color: "#666", marginTop: "4px" }}>
            ALEJANDRO · ATLETA
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px", color: "#888", marginBottom: "6px" }}>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#fff", padding: "12px", fontFamily: "monospace", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px", color: "#888", marginBottom: "6px" }}>CONTRASEÑA</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#fff", padding: "12px", fontFamily: "monospace", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {error && (
            <div style={{ fontFamily: "monospace", fontSize: "12px", color: "#ff4d1f", textAlign: "center" }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ background: "#ff4d1f", color: "#fff", border: "none", padding: "14px", fontFamily: "monospace", fontSize: "12px", letterSpacing: "3px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: "8px" }}
          >
            {loading ? "ENTRANDO..." : "ENTRAR"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontFamily: "monospace", fontSize: "11px", color: "#555" }}>
          ¿Primera vez?{" "}
          <Link href="/register" style={{ color: "#ff4d1f", textDecoration: "none" }}>Crear cuenta</Link>
        </div>
      </div>
    </div>
  );
}
