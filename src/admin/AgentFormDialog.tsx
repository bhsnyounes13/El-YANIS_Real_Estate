import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Agent } from "@/lib/domain/types";
import { ApiError } from "@/lib/api/client";
import { prepareImageFileForUpload } from "@/lib/imageUpload";
import {
  presignPropertyImageUpload,
  putBlobToPresignedUrl,
} from "@/lib/api/services/upload.service";
import {
  agentFormSchema,
  agentToFormValues,
  formValuesToAgentWrite,
  getEmptyAgentForm,
  type AgentFormValues,
} from "./agentForm";

interface AgentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit" | "view";
  initial: Agent | null;
  isSubmitting: boolean;
  onSubmit: (payload: ReturnType<typeof formValuesToAgentWrite>) => void;
}

const AgentFormDialog = ({
  open,
  onOpenChange,
  mode,
  initial,
  isSubmitting,
  onSubmit,
}: AgentFormDialogProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: getEmptyAgentForm(),
  });

  useEffect(() => {
    if (!open) return;
    if (initial) form.reset(agentToFormValues(initial));
    else form.reset(getEmptyAgentForm());
  }, [open, initial, form]);

  const readOnly = mode === "view";
  const title = mode === "create" ? "Nouvel agent" : mode === "edit" ? "Modifier l’agent" : "Agent";

  const photoValue = form.watch("photo");

  const handleUploadPhoto = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Le fichier doit être une image.", variant: "destructive" });
      return;
    }
    setUploadingPhoto(true);
    try {
      const prepared = await prepareImageFileForUpload(file, { maxSide: 1200, quality: 0.85 });
      const { uploadUrl, publicUrl } = await presignPropertyImageUpload(prepared.contentType);
      await putBlobToPresignedUrl(uploadUrl, prepared.blob, prepared.contentType);
      form.setValue("photo", publicUrl, { shouldValidate: true });
      toast({ title: "Photo importée" });
    } catch (error) {
      if (error instanceof ApiError && error.status === 503) {
        toast({
          title: "Stockage non configuré",
          description:
            "Configurez le stockage cloud/local côté API, ou collez une URL photo manuellement.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Import impossible",
          description: error instanceof Error ? error.message : undefined,
          variant: "destructive",
        });
      }
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Nom complet et téléphone sont obligatoires. Les autres champs sont optionnels.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => onSubmit(formValuesToAgentWrite(values)))} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet *</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone *</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3 rounded-xl border p-3">
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo de profil</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} disabled={readOnly || uploadingPhoto} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!readOnly ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={uploadingPhoto}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploadingPhoto ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Importer une photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      void handleUploadPhoto(e.target.files);
                      e.target.value = "";
                    }}
                  />
                  <span className="text-xs text-muted-foreground">Format recommandé : portrait 4:5.</span>
                </div>
              ) : null}

              <div className="overflow-hidden rounded-xl border bg-muted">
                {photoValue ? (
                  <img src={photoValue} alt="" className="aspect-[4/5] w-full object-cover object-center" />
                ) : (
                  <div className="flex aspect-[4/5] items-center justify-center text-sm text-muted-foreground">
                    <ImagePlus className="mr-2 h-4 w-4" />
                    Aucune photo
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle / poste</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="agency_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agence</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={readOnly}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input placeholder="https://facebook.com/..." {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="https://instagram.com/..." {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/..." {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="bio_fr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio FR</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[92px]" {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio EN</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[92px]" {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio AR</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[92px]" {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              {!readOnly ? (
                <Button type="submit" disabled={isSubmitting || uploadingPhoto}>
                  {mode === "create" ? "Créer l’agent" : "Enregistrer"}
                </Button>
              ) : null}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AgentFormDialog;
