"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const sb = createClient();
    const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    const { data: profile } = await sb.from("rfi_user_profiles").select("role,is_active").eq("user_id", data.user.id).maybeSingle();
    if (!profile || !profile.is_active) {
      await sb.auth.signOut();
      setError("Your portal access is not active. Contact the RFI administrator.");
      setBusy(false);
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <main className="login-screen">
      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />
      <div className="login-layout">
        <section className="login-brand-panel">
          <div className="login-brand">
            <img src="/192x192%20new.png" alt="Crescent RFI" />
            <div><strong>CRESCENT</strong><span>CONTRACTORS</span></div>
          </div>
          <div className="login-brand-copy">
            <div className="login-eyebrow"><span /> QUALITY MANAGEMENT SYSTEM</div>
            <h1>Every inspection.<br /><em>In control.</em></h1>
            <p>A connected workspace for RFI submissions, inspection checklists and document sign-offs across your projects.</p>
          </div>
          <div className="login-feature-list">
            <div><span className="login-feature-icon">✓</span><span><b>RFI tracking</b><small>Follow every inspection from readiness to closure.</small></span></div>
            <div><span className="login-feature-icon">⌁</span><span><b>Checklist control</b><small>Keep applicable documents and signatures aligned.</small></span></div>
            <div><span className="login-feature-icon">◷</span><span><b>Live project visibility</b><small>See pending actions across project locations.</small></span></div>
          </div>
          <div className="login-brand-footer">CRESCENT RFI <span>•</span> QUALITY SYSTEMS</div>
        </section>

        <section className="login-form-side">
          <form className="login-card" onSubmit={submit}>
            <div className="login-mobile-brand">
              <img src="/192x192%20new.png" alt="" />
              <span>CRESCENT RFI</span>
            </div>
            <div className="login-card-kicker">SECURE PORTAL ACCESS</div>
            <h2>Welcome back</h2>
            <p className="login-card-subtitle">Sign in with your authorised Crescent account.</p>

            <label className="login-label" htmlFor="login-email">Email address</label>
            <div className="login-input-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>
              <input id="login-email" type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@crescentcontractors.com" />
            </div>

            <div className="login-password-heading"><label className="login-label" htmlFor="login-password">Password</label></div>
            <div className="login-input-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
              <input id="login-password" type={showPassword ? "text" : "password"} required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" />
              <button className="login-show-password" type="button" onClick={() => setShowPassword(v => !v)}>{showPassword ? "Hide" : "Show"}</button>
            </div>

            {error && <div className="login-error" role="alert">{error}</div>}
            <button className="login-submit" type="submit" disabled={busy}>
              <span>{busy ? "Signing in…" : "Sign in to Crescent RFI"}</span>
              {!busy && <span aria-hidden="true">→</span>}
            </button>
            <div className="login-security"><span>◆</span> Your connection and account access are protected.</div>
            <div className="login-admin-note">Access is managed by the RFI Portal administrator.</div>
          </form>
          <div className="login-copyright">© {new Date().getFullYear()} Crescent Contractors. All rights reserved.</div>
        </section>
      </div>
    </main>
  );
}
