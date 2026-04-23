import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Home, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth/AuthContext";
import { loginRequest } from "@/lib/auth/authApi";
import { TurnstileField } from "@/components/security/TurnstileField";
import { useTurnstileSubmissionGate } from "@/hooks/useTurnstileSubmissionGate";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { status, user, setSessionFromLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const { turnstileToken, setTurnstileToken, canSubmitWithTurnstile } =
    useTurnstileSubmissionGate();

  const fromPath = useMemo(() => {
    const st = location.state as { from?: { pathname?: string } } | null;
    const p = st?.from?.pathname;
    if (p && p !== "/admin/login") return p;
    return "/admin";
  }, [location.state]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  if (status === "authenticated" && user?.role === "admin") {
    return <Navigate to={fromPath} replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const { accessToken, user: u } = await loginRequest(email.trim(), password, turnstileToken);
      if (u.role !== "admin") {
        setError("Accès réservé aux administrateurs.");
        return;
      }
      setSessionFromLogin(accessToken, u);
      navigate(fromPath, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de la connexion.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Lock className="h-6 w-6" aria-hidden />
          </div>
          <CardTitle className="text-2xl">Administration EL-YANIS</CardTitle>
          <CardDescription>
            Connexion sécurisée via le serveur (JWT + cookie refresh httpOnly).
          </CardDescription>
        </CardHeader>
        <form onSubmit={(e) => void onSubmit(e)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={pending}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Mot de passe</Label>
              <Input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={pending}
                placeholder="••••••••"
                className="h-11"
              />
            </div>
            <TurnstileField onTokenChange={setTurnstileToken} />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full h-11"
              disabled={pending || !email.trim() || !password.trim() || !canSubmitWithTurnstile}
            >
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion…
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Retour au site
              </Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
