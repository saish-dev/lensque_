import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="login">
      <div className="login-art panel">
        <span className="glow" />
        <p className="login-quote">Every frame tells a different story.</p>
      </div>
      <div className="login-form-wrap">
        <LoginForm />
      </div>
    </div>
  );
}
