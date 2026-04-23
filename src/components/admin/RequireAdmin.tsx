import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

interface RequireAdminProps {
  children: ReactNode;
}

/**
 * Garde d’expérience utilisateur uniquement : masque l’UI admin aux non-admins.
 * L’autorisation réelle est **exclusivement** appliquée par l’API (`requireRoles("admin")`, JWT).
 */
const RequireAdmin = ({ children }: RequireAdminProps) => {
  const location = useLocation();
  const { status, user } = useAuth();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  if (status !== "authenticated" || user?.role !== "admin") {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default RequireAdmin;
