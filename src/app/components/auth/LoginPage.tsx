import { ArrowRight, LockKeyhole, ShieldCheck, Stethoscope } from "lucide-react";

interface LoginPageProps {
  error?: string;
  onLogin: () => void;
  onLogout: () => void;
}

export function LoginPage({ error, onLogin, onLogout }: LoginPageProps) {
  const accessDenied = Boolean(error);

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden bg-primary px-12 py-14 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3 text-lg font-semibold"><span className="flex size-10 items-center justify-center rounded-md bg-white/15"><Stethoscope className="size-5" /></span>CareFlow</div>
        <div className="max-w-md"><p className="text-sm font-medium text-white/75">Clinical operations platform</p><h1 className="mt-4 text-4xl font-semibold leading-tight">The care team starts here.</h1><p className="mt-5 max-w-sm text-base leading-7 text-white/80">Secure access to the right hospital workflows, based on your CareFlow role.</p></div>
        <p className="text-xs text-white/60">CareFlow Healthcare Platform</p>
      </section>
      <section className="flex items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden"><span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground"><Stethoscope className="size-5" /></span><span className="text-lg font-semibold text-foreground">CareFlow</span></div>
          <div className="mb-8"><div className="mb-5 flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary"><ShieldCheck className="size-6" /></div><h2 className="text-2xl font-semibold text-foreground">{accessDenied ? "Access needs approval" : "Sign in"}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{accessDenied ? error : "Use your organization account to continue to CareFlow."}</p></div>
          <button type="button" onClick={accessDenied ? onLogout : onLogin} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">{accessDenied ? "Use a different account" : "Continue with secure sign-in"}<ArrowRight className="size-4" /></button>
          <div className="mt-8 flex items-start gap-3 border-t border-border pt-6 text-xs leading-5 text-muted-foreground"><LockKeyhole className="mt-0.5 size-4 shrink-0 text-primary" /><p>Authentication is handled by your organization&apos;s identity provider. CareFlow never stores your password.</p></div>
        </div>
      </section>
    </main>
  );
}
