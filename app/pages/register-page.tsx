import { AlertCircle, CheckCircle2, LoaderCircle, Mail, UserRound } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthToast, type ToastState } from "@/components/auth/auth-toast";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordRequirements } from "@/components/auth/password-requirements";
import { AuthDivider, SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { Button } from "@/components/ui/button";
import { isStrongPassword } from "@/lib/password-validation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  checkUsername,
  clearAuthError,
  registerUser,
  resetUsernameCheck,
  type UsernameStatus,
} from "@/store/auth-slice";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[A-Za-z0-9_-]+$/;

const initialValues = { fullName: "", username: "", email: "", password: "", confirmPassword: "", agreed: false };

function validate(values: typeof initialValues, usernameStatus: UsernameStatus) {
  const errors: Record<string, string> = {};
  const nameLength = values.fullName.trim().length;
  if (!nameLength) errors.fullName = "Full name is required.";
  else if (nameLength < 2 || nameLength > 80) errors.fullName = "Full name must be between 2 and 80 characters.";
  if (!values.username) errors.username = "Username is required.";
  else if (values.username.length < 3 || values.username.length > 30) errors.username = "Username must be between 3 and 30 characters.";
  else if (!usernamePattern.test(values.username)) errors.username = "Use only letters, numbers, underscores, or hyphens.";
  else if (usernameStatus === "taken") errors.username = "This username is already taken.";
  if (!values.email.trim()) errors.email = "Email address is required.";
  else if (!emailPattern.test(values.email.trim())) errors.email = "Enter a valid email address.";
  if (!values.password) errors.password = "Password is required.";
  else if (!isStrongPassword(values.password)) errors.password = "Password does not meet all requirements.";
  if (!values.confirmPassword) errors.confirmPassword = "Please confirm your password.";
  else if (values.confirmPassword !== values.password) errors.confirmPassword = "Passwords do not match.";
  if (!values.agreed) errors.agreed = "You must agree to the Terms of Service and Privacy Policy.";
  return errors;
}

export function RegisterPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<ToastState>(null);
  const dispatch = useAppDispatch();
  const { status, error: serverError, usernameStatus } = useAppSelector((state) => state.auth);
  const submitting = status === "loading";
  const errors = validate(values, usernameStatus);
  const formValid = Object.keys(errors).length === 0;

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const username = values.username;
    if (username.length < 3 || username.length > 30 || !usernamePattern.test(username)) {
      return;
    }
    const timeout = window.setTimeout(() => {
      void dispatch(checkUsername(username));
    }, 350);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [dispatch, values.username]);

  const setField = (field: keyof typeof initialValues, value: string | boolean) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (field === "username" && typeof value === "string") {
      dispatch(resetUsernameCheck());
    }
    if (serverError) dispatch(clearAuthError());
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched({ fullName: true, username: true, email: true, password: true, confirmPassword: true, agreed: true });
    if (!formValid) return;
    try {
      await dispatch(registerUser({ fullName: values.fullName.trim(), username: values.username, email: values.email.trim(), password: values.password })).unwrap();
      setToast({ tone: "success", message: "Account created successfully. Taking you to sign in…" });
      window.setTimeout(() => onNavigate("/login"), 900);
    } catch (error) {
      const message = typeof error === "string" ? error : "Unable to create your account. Please try again.";
      setToast({ tone: "error", message });
    }
  }

  const fieldError = (field: string) => touched[field] ? errors[field] : undefined;

  return (
    <>
      <AuthLayout
        wide
        title="Create your account"
        description="Join PromptHub and start managing your prompts"
        footer={<>Already have an account? <button type="button" onClick={() => onNavigate("/login")} className="auth-link">Sign in</button></>}
      >
        <form noValidate onSubmit={handleSubmit}>
          {serverError && <div role="alert" className="mb-5 flex gap-2.5 rounded-lg border border-red-500/20 bg-red-500/[.07] p-3 text-xs leading-5 text-red-300"><AlertCircle className="mt-0.5 size-4 shrink-0" />{serverError}</div>}

          <AuthField id="register-name" label="Full name" placeholder="Enter your full name" icon={<UserRound />} autoComplete="name" value={values.fullName} error={fieldError("fullName")} onChange={(value) => setField("fullName", value)} onBlur={() => setTouched((current) => ({ ...current, fullName: true }))} autoFocus />
          <div className="mt-4">
            <label htmlFor="register-username" className="mb-2 block text-xs font-medium text-slate-300">Username</label>
            <div className="relative flex">
              <span className="flex h-11 items-center rounded-l-lg border border-r-0 border-white/[.1] bg-white/[.025] px-3 text-[11px] text-slate-600">prompthub.com/</span>
              <input id="register-username" autoComplete="username" placeholder="Choose a username" value={values.username} onChange={(event) => setField("username", event.target.value)} onBlur={() => setTouched((current) => ({ ...current, username: true }))} aria-invalid={Boolean(fieldError("username"))} className={`auth-input rounded-l-none ${fieldError("username") ? "auth-input-error" : ""}`} />
              {usernameStatus === "checking" && <LoaderCircle className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-slate-500" />}
              {usernameStatus === "available" && <CheckCircle2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-emerald-400" />}
            </div>
            {usernameStatus === "available" && <p className="mt-1.5 text-xs text-emerald-400">Username is available.</p>}
            {usernameStatus === "checking" && <p className="mt-1.5 text-xs text-slate-500">Checking username availability…</p>}
            {usernameStatus === "error" && <p className="mt-1.5 text-xs text-amber-400">Availability check is temporarily unavailable. We&apos;ll verify when you submit.</p>}
            {fieldError("username") && <p role="alert" className="mt-1.5 text-xs text-red-400">{fieldError("username")}</p>}
          </div>

          <div className="mt-4"><AuthField id="register-email" label="Email address" type="email" placeholder="you@example.com" icon={<Mail />} autoComplete="email" value={values.email} error={fieldError("email")} onChange={(value) => setField("email", value)} onBlur={() => setTouched((current) => ({ ...current, email: true }))} /></div>
          <div className="mt-4"><PasswordInput id="register-password" name="password" label="Password" placeholder="Create a password" autoComplete="new-password" value={values.password} onChange={(event) => setField("password", event.target.value)} onBlur={() => setTouched((current) => ({ ...current, password: true }))} error={fieldError("password")} /></div>
          <div className="mt-3"><PasswordRequirements password={values.password} /></div>
          <div className="mt-4"><PasswordInput id="register-confirm-password" name="confirmPassword" label="Confirm password" placeholder="Enter your password again" autoComplete="new-password" value={values.confirmPassword} onChange={(event) => setField("confirmPassword", event.target.value)} onBlur={() => setTouched((current) => ({ ...current, confirmPassword: true }))} error={fieldError("confirmPassword")} /></div>

          <div className="mt-5">
            <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-5 text-slate-400">
              <input type="checkbox" checked={values.agreed} onChange={(event) => { setField("agreed", event.target.checked); setTouched((current) => ({ ...current, agreed: true })); }} className="auth-checkbox mt-0.5" />
              <span>I agree to the <a href="/terms" className="auth-link">Terms of Service</a> and <a href="/privacy" className="auth-link">Privacy Policy</a></span>
            </label>
            {fieldError("agreed") && <p role="alert" className="mt-1.5 text-xs text-red-400">{fieldError("agreed")}</p>}
          </div>

          <Button type="submit" disabled={!formValid || submitting} className="mt-5 w-full">
            {submitting ? <><LoaderCircle className="size-4 animate-spin" /> Creating account…</> : "Create account"}
          </Button>
          <AuthDivider>or sign up with</AuthDivider>
          <SocialAuthButtons onProvider={(provider) => setToast({ tone: "info", message: `${provider} sign-up is ready for OAuth configuration.` })} />
        </form>
      </AuthLayout>
      <AuthToast toast={toast} />
    </>
  );
}

interface AuthFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  icon: React.ReactNode;
  autoComplete?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  autoFocus?: boolean;
}

function AuthField({ id, label, type = "text", placeholder, icon, value, error, onChange, onBlur, ...props }: AuthFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-medium text-slate-300">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 [&>svg]:size-4">{icon}</span>
        <input {...props} id={id} type={type} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} onBlur={onBlur} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={`auth-input pl-10 ${error ? "auth-input-error" : ""}`} />
      </div>
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
