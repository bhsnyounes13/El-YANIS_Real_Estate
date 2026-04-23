import { useMemo, useState } from "react";
import { isTurnstileConfigured } from "@/lib/security/turnstileEnv";

/** Bloque la soumission tant qu’aucun jeton Turnstile n’est obtenu si la clé site est configurée. */
export function useTurnstileSubmissionGate() {
  const [token, setToken] = useState<string | null>(null);
  const required = useMemo(() => isTurnstileConfigured(), []);
  const canSubmit = !required || Boolean(token && token.length > 0);

  return {
    turnstileToken: token ?? undefined,
    setTurnstileToken: setToken,
    turnstileRequired: required,
    canSubmitWithTurnstile: canSubmit,
  };
}
