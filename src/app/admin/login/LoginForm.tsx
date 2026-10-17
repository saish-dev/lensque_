"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="login-form">
      <div>
        <div className="brand">LENSQUE</div>
        <div className="eyebrow" style={{ marginTop: 10, fontSize: 11 }}>Studio admin</div>
      </div>
      <h1 className="display" style={{ fontSize: 44 }}>
        Welcome <span className="shimmer">back.</span>
      </h1>
      <label className="field">
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label className="field">
        Password
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
