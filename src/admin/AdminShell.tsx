import { useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  ChevronRight,
  Download,
  Eye,
  Home,
  LogOut,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  Upload,
  UserCog,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAdminAgents } from "@/hooks/admin/useAdminAgents";
import { useAdminInquiries } from "@/hooks/admin/useAdminInquiries";
import { useAdminPropertyCatalog } from "@/hooks/admin/useAdminPropertyCatalog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/AuthContext";
import type { AgentWriteInput } from "@/lib/api/services/adminApi.service";
import type { Agent } from "@/lib/domain/types";
import type { Property } from "@/lib/domain/types";
import AgentFormDialog from "./AgentFormDialog";
import PropertyFormDialog from "./PropertyFormDialog";

type MenuKey = "overview" | "properties" | "inquiries" | "agents" | "settings";

const menu = [
  { key: "overview" as const, label: "Vue d’ensemble", icon: LayoutDashboard },
  { key: "properties" as const, label: "Biens", icon: Building2 },
  { key: "inquiries" as const, label: "Demandes", icon: MessageSquare },
  { key: "agents" as const, label: "Agents", icon: Users },
  { key: "settings" as const, label: "Réglages", icon: Settings },
];

const CHART_COLORS = ["#1d4ed8", "#5E52B4", "#7f2500", "#64748b"];

function formatMoney(n: number) {
  return new Intl.NumberFormat("fr-DZ", { maximumFractionDigits: 0 }).format(n);
}

function Sidebar({ active, setActive }: { active: MenuKey; setActive: (k: MenuKey) => void }) {
  const location = useLocation();
  const usersActive = location.pathname.includes("admin/users");

  return (
    <div className="flex h-full flex-col rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Home className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            EL-YANIS
          </p>
          <p className="font-semibold leading-tight">Administration</p>
        </div>
      </div>
      <nav className="mt-6 flex flex-col gap-1">
        <Link
          to="/admin/users"
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
            usersActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <UserCog className="h-4 w-4 shrink-0" />
          Utilisateurs
        </Link>
        {menu.map((item) => {
          const Icon = item.icon;
          const sel = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActive(item.key)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                sel ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <p className="mt-auto pt-6 text-xs leading-relaxed text-muted-foreground">
        Les biens et les demandes proviennent de l’API : connectez-vous avec un compte
        administrateur serveur pour les gérer.
      </p>
    </div>
  );
}

const AdminShell = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();
  const [active, setActive] = useState<MenuKey>("overview");
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Property | null>(null);
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);
  const [agentDialogMode, setAgentDialogMode] = useState<"create" | "edit" | "view">("create");
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [deleteAgentId, setDeleteAgentId] = useState<string | null>(null);
  const [agentQuery, setAgentQuery] = useState("");
  const [agentStatusFilter, setAgentStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [deletePropertyId, setDeletePropertyId] = useState<string | null>(null);
  const [deleteInquiry, setDeleteInquiry] = useState<{
    kind: "contact" | "property";
    id: string;
  } | null>(null);
  const [importText, setImportText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    query: propQuery,
    create,
    update,
    remove,
    importJson,
    exportCatalogJson,
  } = useAdminPropertyCatalog();
  const { query: inqQuery, remove: removeInq } = useAdminInquiries();
  const adminAgents = useAdminAgents();

  const properties = useMemo(() => propQuery.data ?? [], [propQuery.data]);
  const inquiries = useMemo(() => inqQuery.data ?? [], [inqQuery.data]);
  const agents = useMemo(() => adminAgents.query.data ?? [], [adminAgents.query.data]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return properties;
    return properties.filter(
      (p) =>
        p.title_fr.toLowerCase().includes(q) ||
        p.title_en.toLowerCase().includes(q) ||
        p.id.includes(q) ||
        p.city.toLowerCase().includes(q),
    );
  }, [properties, query]);

  const stats = useMemo(() => {
    const sale = properties.filter((p) => p.type === "sale").length;
    const rent = properties.filter((p) => p.type === "rent").length;
    const featured = properties.filter((p) => p.featured).length;
    return {
      total: properties.length,
      sale,
      rent,
      featured,
      inquiries: inquiries.length,
      agents: agents.length,
    };
  }, [properties, inquiries, agents]);

  const filteredAgents = useMemo(() => {
    const q = agentQuery.toLowerCase().trim();
    return agents.filter((agent) => {
      if (agentStatusFilter !== "all" && (agent.status ?? "active") !== agentStatusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        agent.name.toLowerCase().includes(q) ||
        (agent.phone ?? "").toLowerCase().includes(q) ||
        (agent.email ?? "").toLowerCase().includes(q)
      );
    });
  }, [agents, agentQuery, agentStatusFilter]);

  const pieType = useMemo(
    () => [
      { name: "Vente", value: stats.sale },
      { name: "Location", value: stats.rent },
    ],
    [stats.sale, stats.rent],
  );

  const barCities = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of properties) {
      m[p.city] = (m[p.city] ?? 0) + 1;
    }
    const labels: Record<string, string> = {
      tlemcen: "Tlemcen",
      ainTemouchent: "Aïn Tém.",
      sidiBelAbbes: "SBA",
    };
    return Object.entries(m).map(([k, value]) => ({ name: labels[k] ?? k, value }));
  }, [properties]);

  const openCreate = () => {
    setFormMode("create");
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (p: Property) => {
    setFormMode("edit");
    setEditing(p);
    setFormOpen(true);
  };

  const openCreateAgent = () => {
    setAgentDialogMode("create");
    setEditingAgent(null);
    setAgentDialogOpen(true);
  };

  const openViewAgent = (agent: Agent) => {
    setAgentDialogMode("view");
    setEditingAgent(agent);
    setAgentDialogOpen(true);
  };

  const openEditAgent = (agent: Agent) => {
    setAgentDialogMode("edit");
    setEditingAgent(agent);
    setAgentDialogOpen(true);
  };

  const handleCreate = (p: Property) => {
    create.mutate(p, {
      onSuccess: () => {
        toast({ title: "Bien créé" });
        setFormOpen(false);
      },
      onError: () =>
        toast({
          title: "Erreur",
          description: "ID déjà utilisé ou données invalides.",
          variant: "destructive",
        }),
    });
  };

  const handleUpdate = (p: Property) => {
    update.mutate(p, {
      onSuccess: () => {
        toast({ title: "Bien enregistré" });
        setFormOpen(false);
      },
      onError: () => toast({ title: "Erreur", variant: "destructive" }),
    });
  };

  const handleAgentSubmit = (payload: AgentWriteInput) => {
    if (agentDialogMode === "create") {
      adminAgents.create.mutate(payload, {
        onSuccess: () => {
          toast({ title: "Agent créé" });
          setAgentDialogOpen(false);
        },
        onError: (err) =>
          toast({
            title: "Erreur",
            description: err instanceof Error ? err.message : undefined,
            variant: "destructive",
          }),
      });
      return;
    }
    if (!editingAgent) return;
    adminAgents.update.mutate(
      { id: editingAgent.id, payload },
      {
        onSuccess: () => {
          toast({ title: "Agent enregistré" });
          setAgentDialogOpen(false);
          setEditingAgent(null);
        },
        onError: (err) =>
          toast({
            title: "Erreur",
            description: err instanceof Error ? err.message : undefined,
            variant: "destructive",
          }),
      },
    );
  };

  const confirmDeleteProperty = () => {
    if (!deletePropertyId) return;
    remove.mutate(deletePropertyId, {
      onSuccess: () => {
        toast({ title: "Bien supprimé" });
        setDeletePropertyId(null);
      },
    });
  };

  const confirmDeleteInquiry = () => {
    if (!deleteInquiry) return;
    removeInq.mutate(
      { kind: deleteInquiry.kind, id: deleteInquiry.id },
      {
        onSuccess: () => {
          toast({ title: "Demande supprimée" });
          setDeleteInquiry(null);
        },
      },
    );
  };

  const confirmDeleteAgent = () => {
    if (!deleteAgentId) return;
    adminAgents.remove.mutate(deleteAgentId, {
      onSuccess: () => {
        toast({ title: "Agent supprimé" });
        setDeleteAgentId(null);
      },
      onError: (err) =>
        toast({
          title: "Suppression impossible",
          description: err instanceof Error ? err.message : undefined,
          variant: "destructive",
        }),
    });
  };

  const doExportCatalog = () => {
    const json = exportCatalogJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "elyanis-properties.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export téléchargé" });
  };

  const doImport = () => {
    importJson.mutate(importText, {
      onSuccess: () => {
        toast({ title: "Catalogue importé" });
        setImportText("");
      },
      onError: (e) =>
        toast({
          title: "Import impossible",
          description: e instanceof Error ? e.message : undefined,
          variant: "destructive",
        }),
    });
  };

  const onFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    importJson.mutate(text, {
      onSuccess: () => toast({ title: "Catalogue importé" }),
      onError: (err) =>
        toast({
          title: "Fichier invalide",
          description: err instanceof Error ? err.message : undefined,
          variant: "destructive",
        }),
    });
    e.target.value = "";
  };

  const sectionTitle = menu.find((m) => m.key === active)?.label ?? "";

  const overview = (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Biens publiés</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ventes</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{stats.sale}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Locations</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{stats.rent}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>À la une</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{stats.featured}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Demandes (API)</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{stats.inquiries}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Agents</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{stats.agents}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Répartition vente / location</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieType}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {pieType.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Biens par ville</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barCities}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dernières demandes</CardTitle>
          <CardDescription>
            Soumissions contact et demandes sur fiches bien (serveur)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {inquiries.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune demande enregistrée.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.slice(0, 8).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(row.createdAt).toLocaleString("fr-DZ", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {row.kind === "contact" ? "Contact" : "Bien"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {row.message}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const propertiesSection = (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Catalogue</CardTitle>
          <CardDescription>
            Créer, modifier ou supprimer des annonces sur le serveur
          </CardDescription>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Nouveau bien
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher titre, ville, id…"
            className="ps-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Titre (FR)</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Prix (DZD)</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="max-w-[200px] truncate font-medium">{p.title_fr}</TableCell>
                  <TableCell>
                    <Badge variant={p.type === "rent" ? "secondary" : "default"}>
                      {p.type === "sale" ? "Vente" : "Location"}
                    </Badge>
                  </TableCell>
                  <TableCell className="tabular-nums">{formatMoney(p.price)}</TableCell>
                  <TableCell className="text-muted-foreground">{p.city}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/property/${p.id}`} target="_blank" rel="noreferrer">
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => setDeletePropertyId(p.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  const inquiriesSection = (
    <Card>
      <CardHeader>
        <CardTitle>Demandes</CardTitle>
        <CardDescription>Demandes reçues via l’API (suppression côté serveur)</CardDescription>
      </CardHeader>
      <CardContent>
        {inquiries.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune demande.</p>
        ) : (
          <div className="space-y-3">
            {inquiries.map((row) => (
              <div
                key={row.id}
                className="flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{row.name}</span>
                    <Badge variant="outline">{row.kind === "contact" ? "Contact" : "Bien"}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {row.propertyTitle ? `${row.propertyTitle} · ` : ""}
                    {row.email}
                    {row.phone ? ` · ${row.phone}` : ""}
                  </p>
                  <p className="line-clamp-2 text-sm">{row.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(row.createdAt).toLocaleString("fr-DZ")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive"
                    onClick={() => setDeleteInquiry({ kind: row.kind, id: row.id })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const agentsSection = (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Agents</CardTitle>
          <CardDescription>Créer, modifier, désactiver ou supprimer des agents.</CardDescription>
        </div>
        <Button onClick={openCreateAgent}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel agent
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher nom, téléphone, email…"
              className="ps-9"
              value={agentQuery}
              onChange={(e) => setAgentQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(["all", "active", "inactive"] as const).map((status) => (
              <Button
                key={status}
                type="button"
                variant={agentStatusFilter === status ? "default" : "outline"}
                onClick={() => setAgentStatusFilter(status)}
              >
                {status === "all" ? "Tous" : status === "active" ? "Actifs" : "Inactifs"}
              </Button>
            ))}
          </div>
        </div>

        {adminAgents.query.isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement des agents…</p>
        ) : adminAgents.query.isError ? (
          <p className="text-sm text-destructive">
            Erreur de chargement des agents :{" "}
            {adminAgents.query.error instanceof Error ? adminAgents.query.error.message : "inconnue"}
          </p>
        ) : filteredAgents.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <p className="font-medium">No agents yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Commencez par créer le premier agent.</p>
            <Button className="mt-4" onClick={openCreateAgent}>
              Créer un agent
            </Button>
          </div>
        ) : (
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-end">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>{agent.phone}</TableCell>
                    <TableCell className="text-muted-foreground">{agent.email || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={agent.status === "inactive" ? "secondary" : "default"}>
                        {agent.status === "inactive" ? "Inactif" : "Actif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-end">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openViewAgent(agent)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEditAgent(agent)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => setDeleteAgentId(agent.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );

  const settingsSection = (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Import / export catalogue</CardTitle>
          <CardDescription>
            Export : instantané depuis l’API. Import : création séquentielle de biens via{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">POST /api/properties</code>{" "}
            (identifiants générés côté serveur).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Fichier JSON
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={onFilePick}
            />
            <Button variant="outline" onClick={doExportCatalog}>
              <Download className="mr-2 h-4 w-4" /> Télécharger
            </Button>
          </div>
          <Textarea
            placeholder="Coller un tableau JSON de biens puis importer"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="min-h-[120px] font-mono text-xs"
          />
          <Button onClick={doImport} disabled={!importText.trim() || importJson.isPending}>
            Importer le texte
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const content =
    active === "overview"
      ? overview
      : active === "properties"
        ? propertiesSection
        : active === "inquiries"
          ? inquiriesSection
          : active === "agents"
            ? agentsSection
            : settingsSection;

  return (
    <>
      <div className="min-h-screen bg-muted/30">
        <div className="mx-auto grid min-h-screen max-w-[1400px] lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-0 p-4">
              <Sidebar active={active} setActive={setActive} />
            </div>
          </aside>
          <main className="flex flex-col p-4 md:p-6">
            <header className="mb-6 flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[280px] p-4">
                    <Sidebar active={active} setActive={setActive} />
                  </SheetContent>
                </Sheet>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    EL-YANIS
                  </p>
                  <h1 className="text-2xl font-bold tracking-tight">{sectionTitle}</h1>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {active === "properties" && (
                  <Button size="sm" onClick={openCreate}>
                    <Plus className="mr-1 h-4 w-4" /> Bien
                  </Button>
                )}
                <Button variant="outline" size="sm" asChild>
                  <Link to="/">
                    Site public <ChevronRight className="ms-1 h-4 w-4" />
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
            {propQuery.isLoading || inqQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Chargement…</p>
            ) : (
              content
            )}
          </main>
        </div>
      </div>

      <PropertyFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        initial={editing}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        isSubmitting={create.isPending || update.isPending}
      />

      <AgentFormDialog
        open={agentDialogOpen}
        onOpenChange={setAgentDialogOpen}
        mode={agentDialogMode}
        initial={editingAgent}
        isSubmitting={adminAgents.create.isPending || adminAgents.update.isPending}
        onSubmit={handleAgentSubmit}
      />

      <AlertDialog open={Boolean(deletePropertyId)} onOpenChange={() => setDeletePropertyId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce bien ?</AlertDialogTitle>
            <AlertDialogDescription>
              La suppression sera appliquée dans la base de données (irréversible).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDeleteProperty}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={Boolean(deleteInquiry)} onOpenChange={() => setDeleteInquiry(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette demande ?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDeleteInquiry}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={Boolean(deleteAgentId)} onOpenChange={() => setDeleteAgentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet agent ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Les biens liés conserveront leurs données sans agent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDeleteAgent}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminShell;
