import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ChevronLeft, ChevronRight, Rocket } from "lucide-react";
import { useAgents } from "@/hooks/queries/useAgents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Property } from "@/lib/domain/types";
import { cn } from "@/lib/utils";
import PropertyPhotosField from "./PropertyPhotosField";
import {
  getEmptyPropertyForm,
  propertyFormSchema,
  propertyToFormValues,
  formValuesToProperty,
  type PropertyFormValues,
} from "./propertyForm";

const cityLabels: Record<PropertyFormValues["city"], string> = {
  tlemcen: "Tlemcen",
  ainTemouchent: "Aïn Témouchent",
  sidiBelAbbes: "Sidi Bel Abbès",
};

const essentialFieldNames: (keyof PropertyFormValues)[] = [
  "title",
  "type",
  "price",
  "city",
  "images",
];

type FormStep = "basic" | "photos" | "optional" | "preview";

interface PropertyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initial: Property | null;
  onCreate: (p: Property) => void;
  onUpdate: (p: Property) => void;
  isSubmitting: boolean;
}

const PropertyFormDialog = ({
  open,
  onOpenChange,
  mode,
  initial,
  onCreate,
  onUpdate,
  isSubmitting,
}: PropertyFormDialogProps) => {
  const { data: agentList = [] } = useAgents();
  const [quickMode, setQuickMode] = useState(true);
  const [step, setStep] = useState<FormStep>("basic");
  const [submitMode, setSubmitMode] = useState<"draft" | "publish">("publish");
  const submitModeRef = useRef<"draft" | "publish">("publish");

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: getEmptyPropertyForm(),
  });

  const values = form.watch();

  useEffect(() => {
    if (!open) return;
    setStep("basic");
    setSubmitMode("publish");
    submitModeRef.current = "publish";
    setQuickMode(mode === "create");
    if (mode === "edit" && initial) {
      form.reset(propertyToFormValues(initial));
    } else {
      form.reset(getEmptyPropertyForm());
    }
  }, [open, mode, initial, form]);

  const steps = useMemo<FormStep[]>(
    () => (quickMode ? ["basic", "photos", "preview"] : ["basic", "photos", "optional", "preview"]),
    [quickMode],
  );

  const stepIndex = steps.indexOf(step);
  const canGoBack = stepIndex > 0;
  const canGoForward = stepIndex < steps.length - 1;

  const titlePreview = values.title?.trim() || "Titre non renseigné";

  const goForward = async () => {
    const current = steps[stepIndex];
    if (!current) return;
    if (current === "basic") {
      const ok = await form.trigger(["title", "type", "price", "city"]);
      if (!ok) return;
    }
    if (current === "photos") {
      const ok = await form.trigger(["images"]);
      if (!ok) return;
    }
    if (canGoForward) {
      setStep(steps[stepIndex + 1]!);
    }
  };

  const goBack = () => {
    if (!canGoBack) return;
    setStep(steps[stepIndex - 1]!);
  };

  const onSubmit = (rawValues: PropertyFormValues) => {
    const id = mode === "edit" && initial ? initial.id : crypto.randomUUID();
    const preserve = mode === "edit" && initial ? { bookedDates: initial.bookedDates } : undefined;
    const valuesToSave =
      submitModeRef.current === "draft"
        ? { ...rawValues, featured: false, tag_exclusive: false, tag_featured: false }
        : rawValues;
    const property = formValuesToProperty(valuesToSave, id, preserve);
    if (mode === "create") onCreate(property);
    else onUpdate(property);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(92vh,860px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[680px]">
        <DialogHeader className="shrink-0 border-b px-6 py-4 text-start">
          <DialogTitle>{mode === "create" ? "Uploads des biens" : "Modifier le bien"}</DialogTitle>
          <DialogDescription>
            Création rapide : uniquement les champs essentiels sont requis.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="border-b px-6 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  {steps.map((key, index) => (
                    <Badge
                      key={key}
                      variant={step === key ? "default" : "secondary"}
                      className={cn("capitalize", step === key && "shadow-sm")}
                    >
                      {index + 1}.{" "}
                      {key === "basic"
                        ? "Infos"
                        : key === "photos"
                          ? "Photos"
                          : key === "optional"
                            ? "Optionnel"
                            : "Aperçu"}
                    </Badge>
                  ))}
                </div>
                <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <Checkbox checked={quickMode} onCheckedChange={(v) => setQuickMode(Boolean(v))} />
                  <span className="inline-flex items-center gap-1 font-medium text-foreground">
                    <Rocket className="h-3.5 w-3.5" />
                    Mode rapide
                  </span>
                </label>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
              {step === "basic" && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Appartement F4 lumineux au centre-ville" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sale">Vente</SelectItem>
                              <SelectItem value="rent">Location</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {(Object.keys(cityLabels) as PropertyFormValues["city"][]).map((k) => (
                                <SelectItem key={k} value={k}>
                                  {cityLabels[k]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix (DZD) *</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} step={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === "photos" && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photos du bien *</FormLabel>
                        <PropertyPhotosField value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    La première image est utilisée comme couverture automatiquement.
                  </p>
                </div>
              )}

              {step === "optional" && (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chambres</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} step={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salles de bain</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} step={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Surface (m²)</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} step={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="agent_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agent</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value === "__none__" ? "" : value)}
                          value={field.value || "__none__"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="__none__">Aucun agent</SelectItem>
                            {agentList.map((a) => (
                              <SelectItem key={a.id} value={a.id}>
                                {a.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {agentList.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No agents yet. Créez un agent depuis la section « Agents ».
                    </p>
                  ) : null}

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-[120px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amenitiesText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Équipements (séparés par des virgules)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === "preview" && (
                <div className="space-y-4">
                  <div className="rounded-xl border bg-muted/20 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Aperçu rapide</p>
                    <h3 className="mt-1 text-lg font-semibold">{titlePreview}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {values.type === "sale" ? "Vente" : "Location"} · {cityLabels[values.city]} ·{" "}
                      {new Intl.NumberFormat("fr-DZ", { maximumFractionDigits: 0 }).format(values.price)} DZD
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {values.images.length} photo(s) · {values.agent_id ? "Agent assigné" : "Aucun agent"}
                    </p>
                  </div>
                  <div className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground">
                    Champs obligatoires : Titre, Transaction, Prix, Ville et Photo.
                  </div>
                  {submitMode === "draft" ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Enregistrement en brouillon
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <DialogFooter className="shrink-0 border-t px-6 py-4">
              <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between sm:space-x-0">
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Annuler
                  </Button>
                  {canGoBack ? (
                    <Button type="button" variant="outline" onClick={goBack}>
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Retour
                    </Button>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  {canGoForward ? (
                    <Button type="button" onClick={() => void goForward()}>
                      Suivant
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={async () => {
                          const ok = await form.trigger(essentialFieldNames);
                          if (!ok) return;
                          submitModeRef.current = "draft";
                          setSubmitMode("draft");
                          void form.handleSubmit(onSubmit)();
                        }}
                      >
                        Enregistrer brouillon
                      </Button>
                      <Button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => {
                          submitModeRef.current = "publish";
                          setSubmitMode("publish");
                          void form.handleSubmit(onSubmit)();
                        }}
                      >
                        Publier maintenant
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyFormDialog;
