import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Loader2, UserPlus } from "lucide-react";
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
import { registerRequest } from "@/lib/auth/authApi";
import { TurnstileField } from "@/components/security/TurnstileField";
import { useTurnstileSubmissionGate } from "@/hooks/useTurnstileSubmissionGate";

/** Inscription compte standard (`user`). Les admins sont créés via bootstrap serveur ou premier compte. */
const Register = () => {
  const { status, setSessionFromLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const { turnstileToken, setTurnstileToken, canSubmitWithTurnstile } =
    useTurnstileSubmissionGate();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  if (status === "authenticated") {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const { accessToken, user } = await registerRequest(email.trim(), password, turnstileToken);
      setSessionFromLogin(accessToken, user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inscription impossible.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <UserPlus className="h-6 w-6" aria-hidden />
          </div>
          <CardTitle className="text-2xl">Créer un compte</CardTitle>
          <CardDescription>
            Min. 8 caractères. Le premier compte devient administrateur.
          </CardDescription>
        </CardHeader>
        <form onSubmit={(e) => void onSubmit(e)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={pending}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-password">Mot de passe</Label>
              <Input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={pending}
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
              disabled={pending || !email.trim() || password.length < 8 || !canSubmitWithTurnstile}
            >
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création…
                </>
              ) : (
                "S’inscrire"
              )}
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link to="/">Retour au site</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
