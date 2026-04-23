import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAgents } from "@/hooks/queries/useAgents";
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
  FormDescription,
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

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: getEmptyPropertyForm(),
  });

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initial) {
      form.reset(propertyToFormValues(initial));
    } else {
      form.reset(getEmptyPropertyForm());
    }
  }, [open, mode, initial, form]);

  useEffect(() => {
    if (!open || mode !== "create" || agentList.length === 0) return;
    const cur = form.getValues("agent_id");
    if (!cur || !agentList.some((a) => a.id === cur)) {
      form.setValue("agent_id", agentList[0]!.id);
    }
  }, [open, mode, agentList, form]);

  const onSubmit = (values: PropertyFormValues) => {
    const id = mode === "edit" && initial ? initial.id : crypto.randomUUID();
    const preserve = mode === "edit" && initial ? { bookedDates: initial.bookedDates } : undefined;
    const property = formValuesToProperty(values, id, preserve);
    if (mode === "create") onCreate(property);
    else onUpdate(property);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(92vh,800px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[640px]">
        <DialogHeader className="shrink-0 border-b px-6 py-4 text-start">
          <DialogTitle>{mode === "create" ? "Nouveau bien" : "Modifier le bien"}</DialogTitle>
          <DialogDescription>
            Données trilingues enregistrées sur le serveur via l’API (création et modification
            réservées aux administrateurs).
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-6 [-webkit-overflow-scrolling:touch]">
              <div className="space-y-4 py-4 pe-1">
                <div className="grid gap-3 sm:grid-cols-3">
                  {(["title_en", "title_fr", "title_ar"] as const).map((name) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wide">
                            {name === "title_en"
                              ? "Titre EN"
                              : name === "title_fr"
                                ? "Titre FR"
                                : "Titre AR"}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {(["description_en", "description_fr", "description_ar"] as const).map((name) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wide">
                            {name === "description_en"
                              ? "Desc. EN"
                              : name === "description_fr"
                                ? "Desc. FR"
                                : "Desc. AR"}
                          </FormLabel>
                          <FormControl>
                            <Textarea className="min-h-[88px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
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
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix (DZD)</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} step={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="agent_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agent</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
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
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ch.</FormLabel>
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
                        <FormLabel>SdB</FormLabel>
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
                          <Input type="number" min={1} step={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photos du bien</FormLabel>
                      <PropertyPhotosField
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                      />
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
                {form.watch("type") === "rent" && (
                  <FormField
                    control={form.control}
                    name="bookedDatesJson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Périodes réservées (JSON optionnel)</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[80px] font-mono text-xs"
                            placeholder='[{"from":"2026-04-01","to":"2026-04-15"}]'
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Tableau d’objets from/to (YYYY-MM-DD).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <div className="flex flex-wrap gap-4 rounded-lg border p-3">
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(v) => field.onChange(v === true)}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Mis en avant (featured)</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tag_exclusive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(v) => field.onChange(v === true)}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Tag exclusif</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tag_new"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(v) => field.onChange(v === true)}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Tag nouveau</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tag_featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(v) => field.onChange(v === true)}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Tag featured</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="shrink-0 border-t bg-background px-6 py-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {mode === "create" ? "Créer" : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyFormDialog;
