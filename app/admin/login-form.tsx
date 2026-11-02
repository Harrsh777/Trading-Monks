"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <div className="adm-login">
      <form action={action} className="adm-login-card">
        <div className="adm-brand">
          TRADING<span>MONKS</span>
          <small>Content admin</small>
        </div>
        <label>
          <span className="adm-label">Password</span>
          <input
            className="adm-input"
            type="password"
            name="password"
            autoComplete="current-password"
            autoFocus
            required
          />
        </label>
        {state.error && <p className="adm-error" role="alert">{state.error}</p>}
        <button type="submit" className="adm-btn" disabled={pending}>
          {pending ? "Checking…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
