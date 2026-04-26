import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api/client";
import { prepareImageFileForUpload } from "@/lib/imageUpload";
import {
  presignPropertyImageUpload,
  putBlobToPresignedUrl,
} from "@/lib/api/services/upload.service";
import { cn } from "@/lib/utils";

const MAX_IMAGES = 15;
const MAX_FILE_BYTES = 20 * 1024 * 1024;

interface PropertyPhotosFieldProps {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  id?: string;
}

const PropertyPhotosField = ({ value, onChange, disabled, id }: PropertyPhotosFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const { toast } = useToast();

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const next = [...value];
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        if (next.length >= MAX_IMAGES) {
          toast({
            title: "Limite atteinte",
            description: `Maximum ${MAX_IMAGES} images.`,
            variant: "destructive",
          });
          break;
        }
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Ignoré",
            description: `${file.name} n’est pas une image.`,
            variant: "destructive",
          });
          continue;
        }
        if (file.size > MAX_FILE_BYTES) {
          toast({
            title: "Fichier trop lourd",
            description: `${file.name} (max ~20 Mo).`,
            variant: "destructive",
          });
          continue;
        }

        let blob: Blob;
        let contentType: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
        if (file.type === "image/gif") {
          blob = file;
          contentType = "image/gif";
        } else {
          const prepared = await prepareImageFileForUpload(file);
          blob = prepared.blob;
          contentType = prepared.contentType;
        }

        const { uploadUrl, publicUrl } = await presignPropertyImageUpload(contentType);
        await putBlobToPresignedUrl(uploadUrl, blob, contentType);
        next.push(publicUrl);
      }
      onChange(next);
    } catch (e) {
      if (e instanceof ApiError && e.status === 503) {
        toast({
          title: "Stockage non configuré",
          description:
            "En local : STORAGE_LOCAL_ROOT dans .env (dossier disque). En prod : S3/R2 (STORAGE_BUCKET, clés, STORAGE_PUBLIC_URL). Vous pouvez aussi coller des URLs https ci-dessous.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Import impossible",
          description: e instanceof Error ? e.message : undefined,
          variant: "destructive",
        });
      }
    } finally {
      setBusy(false);
    }
  };

  const addUrl = () => {
    const raw = urlDraft.trim();
    if (!raw) return;
    let parsed: URL;
    try {
      parsed = new URL(raw);
    } catch {
      toast({ title: "URL invalide", variant: "destructive" });
      return;
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      toast({ title: "Utilisez http ou https", variant: "destructive" });
      return;
    }
    if (value.length >= MAX_IMAGES) {
      toast({ title: "Limite atteinte", variant: "destructive" });
      return;
    }
    onChange([...value, raw]);
    setUrlDraft("");
  };

  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));

  const move = (index: number, delta: -1 | 1) => {
    const j = index + delta;
    if (j < 0 || j >= value.length) return;
    const cp = [...value];
    [cp[index], cp[j]] = [cp[j], cp[index]];
    onChange(cp);
  };

  const blocked = Boolean(disabled || busy);

  return (
    <div className="space-y-3" id={id}>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={blocked}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Upload className="h-4 w-4" aria-hidden />
          )}
          {busy ? "Traitement…" : "Choisir des fichiers"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          aria-hidden
          onChange={(e) => {
            void addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <span className="text-xs text-muted-foreground">
          JPEG, PNG, WebP, GIF · max {MAX_IMAGES} images
        </span>
      </div>

      <div
        className={cn(
          "rounded-lg border border-dashed p-4 text-center text-sm transition-colors",
          dragOver ? "border-primary bg-primary/5" : "border-border bg-muted/20",
          blocked && "opacity-60",
        )}
        onDragOver={(e) => {
          if (blocked) return;
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          if (blocked) return;
          e.preventDefault();
          setDragOver(false);
          void addFiles(e.dataTransfer.files);
        }}
      >
        Glissez-déposez vos images ici (4:5 recommandé) ou utilisez le bouton ci-dessus.
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          type="url"
          placeholder="Ou coller une URL d’image (https://…)"
          value={urlDraft}
          disabled={blocked}
          onChange={(e) => setUrlDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
          className="font-mono text-sm"
        />
        <Button
          type="button"
          variant="outline"
          disabled={blocked || !urlDraft.trim()}
          onClick={addUrl}
        >
          <ImagePlus className="mr-2 h-4 w-4" />
          Ajouter l’URL
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        La <strong>première</strong> image sert de couverture (cartes, liste). Les fichiers sont
        optimisés puis envoyés vers le stockage cloud (S3/R2) : seules les <strong>URLs</strong>{" "}
        sont enregistrées en base.
      </p>

      {value.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((src, i) => (
            <div
              key={`${i}-${src.length}-${src.slice(0, 24)}`}
              className="group relative overflow-hidden rounded-lg border bg-muted shadow-sm"
            >
              <img
                src={src}
                alt=""
                className="aspect-[4/5] w-full object-cover object-center"
                loading="lazy"
              />
              <div
                className={cn(
                  "absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent p-1.5",
                  "opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100",
                )}
              >
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 shrink-0"
                  disabled={blocked || i === 0}
                  onClick={() => move(i, -1)}
                  aria-label="Monter"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8 shrink-0"
                  disabled={blocked}
                  onClick={() => remove(i)}
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 shrink-0"
                  disabled={blocked || i === value.length - 1}
                  onClick={() => move(i, 1)}
                  aria-label="Descendre"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
              {i === 0 ? (
                <span className="absolute left-1.5 top-1.5 rounded bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                  Couverture
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
          Aucune image pour l’instant — utilisez le bouton ci-dessus ou une URL.
        </div>
      )}
    </div>
  );
};

export default PropertyPhotosField;
