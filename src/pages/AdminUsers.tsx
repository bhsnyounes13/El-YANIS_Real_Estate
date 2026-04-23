import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Home, LogOut, Trash2, UserCog } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";

function apiMessage(err: unknown): string {
  if (err instanceof ApiError && typeof err.body === "object" && err.body !== null) {
    const code = (err.body as { code?: string }).code;
    if (code === "LAST_ADMIN") return "Action impossible : dernier administrateur.";
    if (code === "SELF_DEMOTE_FORBIDDEN")
      return "Ajoutez un autre administrateur avant de changer votre rôle.";
    if (code === "SELF_DELETE_FORBIDDEN")
      return "Vous ne pouvez pas supprimer votre propre compte ici.";
  }
  return err instanceof Error ? err.message : "Une erreur est survenue.";
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: me, logout } = useAuth();
  const { query, updateRole, remove } = useAdminUsers();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const rows = query.data ?? [];
  const adminCount = rows.filter((x) => x.role === "admin").length;

  const confirmDelete = () => {
    if (!deleteId) return;
    remove.mutate(deleteId, {
      onSuccess: () => {
        toast({ title: "Utilisateur supprimé" });
        setDeleteId(null);
      },
      onError: (e) =>
        toast({
          title: "Suppression impossible",
          description: apiMessage(e),
          variant: "destructive",
        }),
    });
  };

  const changeRole = (id: string, role: "admin" | "user") => {
    updateRole.mutate(
      { id, role },
      {
        onSuccess: () => toast({ title: "Rôle mis à jour" }),
        onError: (e) =>
          toast({
            title: "Mise à jour impossible",
            description: apiMessage(e),
            variant: "destructive",
          }),
      },
    );
  };

  return (
    <>
      <div className="min-h-screen bg-muted/30">
        <div className="mx-auto max-w-[1100px] p-4 md:p-6">
          <header className="mb-6 flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <UserCog className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  EL-YANIS
                </p>
                <h1 className="text-2xl font-bold tracking-tight">Utilisateurs</h1>
                <p className="text-sm text-muted-foreground">
                  Gestion des comptes et des rôles (API sécurisée).
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin">
                  Tableau de bord <ChevronRight className="ms-1 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/">
                  Site public <Home className="ms-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => {
                  void logout().then(() => {
                    toast({ title: "Déconnecté" });
                    navigate("/admin/login", { replace: true });
                  });
                }}
              >
                <LogOut className="me-1 h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>Comptes</CardTitle>
              <CardDescription>
                Le rôle « administrateur » est appliqué uniquement par le serveur ; les tentatives
                d’élévation depuis le client sont ignorées.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {query.isLoading ? (
                <p className="text-sm text-muted-foreground">Chargement…</p>
              ) : query.isError ? (
                <p className="text-sm text-destructive">Impossible de charger les utilisateurs.</p>
              ) : rows.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun compte.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Créé le</TableHead>
                      <TableHead className="text-end">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap items-center gap-2">
                            <Select
                              value={u.role}
                              onValueChange={(v) => changeRole(u.id, v as "admin" | "user")}
                              disabled={
                                updateRole.isPending ||
                                remove.isPending ||
                                (me?.id === u.id && u.role === "admin" && adminCount <= 1)
                              }
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Administrateur</SelectItem>
                                <SelectItem value="user">Utilisateur</SelectItem>
                              </SelectContent>
                            </Select>
                            <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                              {u.role === "admin" ? "Admin" : "User"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                          {new Date(u.createdAt).toLocaleString("fr-DZ")}
                        </TableCell>
                        <TableCell className="text-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            disabled={
                              remove.isPending ||
                              updateRole.isPending ||
                              u.id === me?.id ||
                              (u.role === "admin" && adminCount <= 1)
                            }
                            title={
                              u.id === me?.id
                                ? "Impossible de supprimer votre compte"
                                : u.role === "admin" && adminCount <= 1
                                  ? "Dernier administrateur"
                                  : "Supprimer"
                            }
                            onClick={() => setDeleteId(u.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Les sessions associées seront révoquées. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminUsers;
