/**
 * Prépare des images pour envoi vers le stockage objet (S3/R2) : redimensionnement léger,
 * export en JPEG — **aucune** data URL ni persistance locale des binaires.
 */

export interface PreparedImageUpload {
  blob: Blob;
  /** Type MIME envoyé avec le PUT (doit correspondre au presign). */
  contentType: "image/jpeg";
}

/**
 * Lit une image, redimensionne si besoin, renvoie un Blob JPEG (qualité ~0.82).
 */
export async function prepareImageFileForUpload(
  file: File,
  options?: { maxSide?: number; quality?: number },
): Promise<PreparedImageUpload> {
  const maxSide = options?.maxSide ?? 1920;
  const quality = options?.quality ?? 0.82;

  if (!file.type.startsWith("image/")) {
    throw new Error("Le fichier doit être une image.");
  }

  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);

  let w = img.naturalWidth || img.width;
  let h = img.naturalHeight || img.height;
  if (w < 1 || h < 1) throw new Error("Image invalide.");

  if (w > maxSide || h > maxSide) {
    if (w >= h) {
      h = Math.round((h * maxSide) / w);
      w = maxSide;
    } else {
      w = Math.round((w * maxSide) / h);
      h = maxSide;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponible.");

  ctx.drawImage(img, 0, 0, w, h);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (!b) reject(new Error("Export JPEG impossible."));
        else resolve(b);
      },
      "image/jpeg",
      quality,
    );
  });

  return { blob, contentType: "image/jpeg" };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error("Lecture du fichier impossible."));
    r.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Chargement de l’image impossible."));
    img.src = src;
  });
}
