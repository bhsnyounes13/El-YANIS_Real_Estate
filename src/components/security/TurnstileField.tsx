import { Turnstile } from "@marsidev/react-turnstile";
import { useEffect } from "react";
import { TURNSTILE_SITE_KEY } from "@/lib/security/turnstileEnv";

interface TurnstileFieldProps {
  /** Réception du jeton à envoyer au serveur ; `null` si absent ou expiré. */
  onTokenChange: (token: string | null) => void;
}

/**
 * Cloudflare Turnstile — le jeton est **vérifié uniquement côté API**.
 * Sans `VITE_TURNSTILE_SITE_KEY`, le composant ne rend rien (formulaires acceptés si l’API n’exige pas Turnstile).
 */
export function TurnstileField({ onTokenChange }: TurnstileFieldProps) {
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) {
      onTokenChange(null);
    }
  }, [onTokenChange]);

  if (!TURNSTILE_SITE_KEY) return null;

  return (
    <div className="flex min-h-[65px] justify-center py-2">
      <Turnstile
        siteKey={TURNSTILE_SITE_KEY}
        onSuccess={(token) => onTokenChange(token)}
        onExpire={() => onTokenChange(null)}
        onError={() => onTokenChange(null)}
      />
    </div>
  );
}
