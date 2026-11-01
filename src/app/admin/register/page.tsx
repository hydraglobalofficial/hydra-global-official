import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/layout/logo";
import { RegisterForm } from "@/components/admin/register-form";

export const metadata: Metadata = { title: "Admin register", robots: { index: false, follow: false } };

const authCss = `
.hydra-login {
  box-sizing: border-box;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  margin: 0;
  background:
    radial-gradient(ellipse 900px 420px at 50% -10%, rgba(59,130,246,0.28), transparent 60%),
    linear-gradient(165deg, #0b1220 0%, #07090e 48%, #05070c 100%);
}
html.light .hydra-login,
html[data-theme="light"] .hydra-login {
  background:
    radial-gradient(ellipse 800px 380px at 50% -8%, rgba(37,99,235,0.16), transparent 58%),
    linear-gradient(165deg, #dbe4f0 0%, #e8edf4 40%, #eef2f7 100%);
}
.hydra-login *,
.hydra-login *::before,
.hydra-login *::after { box-sizing: border-box; }
.hydra-login-shell { width: 100%; max-width: 380px; }
.hydra-login-card {
  position: relative;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.12);
  background: linear-gradient(180deg, rgba(22,28,40,0.98) 0%, rgba(12,16,24,0.98) 100%);
  padding: 26px 24px 22px;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.04),
    0 30px 60px -28px rgba(0,0,0,0.85),
    0 12px 24px -16px rgba(37,99,235,0.25);
  overflow: hidden;
}
html.light .hydra-login-card,
html[data-theme="light"] .hydra-login-card {
  border-color: rgba(15,23,42,0.12);
  background: #ffffff;
  box-shadow:
    0 0 0 1px rgba(15,23,42,0.04),
    0 22px 48px -20px rgba(15,23,42,0.28),
    0 8px 20px -12px rgba(37,99,235,0.12);
}
.hydra-login-card::before {
  content: "";
  position: absolute;
  left: 0; right: 0; top: 0;
  height: 3px;
  background: linear-gradient(90deg, #2563eb, #38bdf8 55%, rgba(56,189,248,0.2));
}
.hydra-login-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
html.light .hydra-login-head,
html[data-theme="light"] .hydra-login-head { border-bottom-color: rgba(15,23,42,0.08); }
.hydra-login-mark {
  width: 44px; height: 44px; flex-shrink: 0; display: grid; place-items: center;
  border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);
  background: linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
}
html.light .hydra-login-mark,
html[data-theme="light"] .hydra-login-mark {
  border-color: rgba(15,23,42,0.1);
  background: linear-gradient(180deg, #f8fafc, #fff);
  box-shadow: 0 1px 2px rgba(15,23,42,0.06);
}
.hydra-login-eyebrow {
  margin: 0; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #60a5fa;
}
html.light .hydra-login-eyebrow,
html[data-theme="light"] .hydra-login-eyebrow { color: #2563eb; }
.hydra-login-title {
  margin: 3px 0 0; font-size: 18px; font-weight: 650; letter-spacing: -0.02em; color: #f4f4f6;
}
html.light .hydra-login-title,
html[data-theme="light"] .hydra-login-title { color: #0a0a0c; }
.hydra-login .admin-auth-form { display: flex; flex-direction: column; gap: 12px; }
.hydra-login .admin-auth-field { display: flex; flex-direction: column; gap: 6px; }
.hydra-login .admin-auth-field label { font-size: 13px; font-weight: 500; color: #a1a1aa; }
html.light .hydra-login .admin-auth-field label,
html[data-theme="light"] .hydra-login .admin-auth-field label { color: #52525b; }
.hydra-login .auth-field {
  width: 100%; height: 44px; border-radius: 11px;
  border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04);
  padding: 0 14px; font-size: 15px; color: #f4f4f6; outline: none;
}
.hydra-login .admin-auth-password { position: relative; }
.hydra-login .admin-auth-password .auth-field { padding-right: 44px; }
.hydra-login .admin-auth-password > button {
  position: absolute; inset-block: 0; right: 0; width: 44px;
  display: flex; align-items: center; justify-content: center;
  border: 0; background: transparent; color: #71717a; cursor: pointer;
}
html.light .hydra-login .auth-field,
html[data-theme="light"] .hydra-login .auth-field {
  border-color: rgba(15,23,42,0.12); background: #f8fafc; color: #0a0a0c;
}
.hydra-login .auth-field:focus {
  border-color: rgba(59,130,246,0.7); box-shadow: 0 0 0 3px rgba(59,130,246,0.22);
}
html.light .hydra-login .auth-field:focus,
html[data-theme="light"] .hydra-login .auth-field:focus { background: #fff; }
.hydra-login .admin-auth-submit {
  margin-top: 4px; height: 44px; width: 100%;
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  border: 0; border-radius: 11px; background: #f4f4f6; color: #0a0a0c;
  font-size: 14px; font-weight: 650; cursor: pointer;
}
html.light .hydra-login .admin-auth-submit,
html[data-theme="light"] .hydra-login .admin-auth-submit { background: #0a0a0c; color: #fff; }
.hydra-login .admin-auth-alt {
  margin: 2px 0 0; text-align: center; font-size: 12px; color: #a1a1aa;
}
html.light .hydra-login .admin-auth-alt,
html[data-theme="light"] .hydra-login .admin-auth-alt { color: #64748b; }
.hydra-login .admin-auth-alt a { color: #60a5fa; font-weight: 600; text-decoration: none; }
html.light .hydra-login .admin-auth-alt a,
html[data-theme="light"] .hydra-login .admin-auth-alt a { color: #2563eb; }
`;

export default function AdminRegisterPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: authCss }} />
      <main className="hydra-login">
        <div className="hydra-login-shell">
          <div className="hydra-login-card">
            <header className="hydra-login-head">
              <div className="hydra-login-mark">
                <LogoMark className="size-7 rounded-md bg-transparent sm:size-7 md:size-7" />
              </div>
              <div>
                <p className="hydra-login-eyebrow">Secure onboarding</p>
                <h1 className="hydra-login-title">Create admin</h1>
              </div>
            </header>
            <RegisterForm />
            <p className="admin-auth-alt" style={{ marginTop: 14 }}>
              Already have access? <Link href="/admin/login">Sign in</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
