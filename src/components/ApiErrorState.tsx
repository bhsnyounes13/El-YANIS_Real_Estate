import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ApiErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
}

/** Bloc d’erreur réseau / API avec action optionnelle de nouvel essai. */
export function ApiErrorState({ title, description, onRetry, retryLabel }: ApiErrorStateProps) {
  return (
    <Alert variant="destructive" className="rounded-2xl border-destructive/30">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="font-heading">{title}</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span>{description}</span>
        {onRetry ? (
          <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={onRetry}>
            {retryLabel ?? "Retry"}
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}
