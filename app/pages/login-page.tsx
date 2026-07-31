import { AlertCircle, LoaderCircle, Mail } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthToast, type ToastState } from "@/components/auth/auth-toast";
import { PasswordInput } from "@/components/auth/password-input";
import { AuthDivider, SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearAuthError, loginUser } from "@/store/auth-slice";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: { email: string; password: string }) {
  const errors: Record<string, string> = {};
  if (!values.email.trim()) errors.email = "Email address is required.";
  else if (!emailPattern.test(values.email.trim())) errors.email = "Enter a valid email address.";
  if (!values.password) errors.password = "Password is required.";
  return errors;
}

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [values, setValues] = useState({ email: "", password: "", remember: false });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<ToastState>(null);
  const dispatch = useAppDispatch();
  const { status, error: serverError } = useAppSelector((state) => state.auth);
  const submitting = status === "loading";
  const errors = validate(values);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const setField = (field: "email" | "password", value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (serverError) dispatch(clearAuthError());
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched({ email: true, password: true });
    if (Object.keys(errors).length) return;

    try {
      await dispatch(loginUser(values)).unwrap();
      setToast({ tone: "success", message: "Welcome back! Redirecting to your workspace…" });
      window.setTimeout(() => onNavigate("/"), 650);
    } catch (error) {
      const message = typeof error === "string" ? error : "Unable to sign in. Please try again.";
      setToast({ tone: "error", message });
    }
  }

  return (
    <>
      <AuthLayout
        title="Welcome back"
        description="Sign in to continue to PromptHub"
        footer={<>Don&apos;t have an account? <button type="button" onClick={() => onNavigate("/register")} className="auth-link">Sign up</button></>}
      >
        <form noValidate onSubmit={handleSubmit}>
          {serverError && (
            <div role="alert" className="mb-5 flex gap-2.5 rounded-lg border border-red-500/20 bg-red-500/[.07] p-3 text-xs leading-5 text-red-300">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <div>
            <label htmlFor="login-email" className="mb-2 block text-xs font-medium text-slate-300">Email address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-600" />
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={(event) => setField("email", event.target.value)}
                onBlur={() => setTouched((current) => ({ ...current, email: true }))}
                aria-invalid={Boolean(touched.email && errors.email)}
                aria-describedby={touched.email && errors.email ? "login-email-error" : undefined}
                className={`auth-input pl-10 ${touched.email && errors.email ? "auth-input-error" : ""}`}
                autoFocus
              />
            </div>
            {touched.email && errors.email && <p id="login-email-error" role="alert" className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
          </div>

          <div className="mt-4">
            <PasswordInput
              id="login-password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={values.password}
              onChange={(event) => setField("password", event.target.value)}
              onBlur={() => setTouched((current) => ({ ...current, password: true }))}
              error={touched.password ? errors.password : undefined}
            />
          </div>

          <div className="my-5 flex items-center justify-between gap-4 text-xs">
            <label className="flex cursor-pointer items-center gap-2 text-slate-400">
              <input type="checkbox" checked={values.remember} onChange={(event) => setValues((current) => ({ ...current, remember: event.target.checked }))} className="auth-checkbox" />
              Remember me
            </label>
            <a href="/forgot-password" className="auth-link">Forgot password?</a>
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? <><LoaderCircle className="size-4 animate-spin" /> Signing in…</> : "Sign in"}
          </Button>
          <AuthDivider>or continue with</AuthDivider>
          <SocialAuthButtons onProvider={(provider) => setToast({ tone: "info", message: `${provider} sign-in is ready for OAuth configuration.` })} />
        </form>
      </AuthLayout>
      <AuthToast toast={toast} />
    </>
  );
}
