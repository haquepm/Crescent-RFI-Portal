"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const [busy, setBusy] = useState(false);

  function logout() {
    if (busy) return;
    setBusy(true);
    // Use a same-origin full-page request so the server can expire the
    // HttpOnly Supabase cookies as well as the browser session.
    window.location.assign("/auth/signout");
  }

  return (
    <button
      type="button"
      className="secondary"
      onClick={logout}
      disabled={busy}
      style={{ display: "inline-flex", alignItems: "center", gap: 7, opacity: busy ? 0.65 : 1 }}
    >
      <LogOut size={15} />
      {busy ? "Signing out…" : "Logout"}
    </button>
  );
}
