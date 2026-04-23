/**
 * Upload direct vers S3/R2 via URL présignée émise par l’API (admin).
 */

import { ApiError, apiPostAuth, fetchWithDiagnostics } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface PresignUploadResponse {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  expiresIn: number;
}

export async function presignPropertyImageUpload(
  contentType: "image/jpeg" | "image/png" | "image/webp" | "image/gif",
): Promise<PresignUploadResponse> {
  return apiPostAuth<PresignUploadResponse>(API_ENDPOINTS.adminUploadPresign, {
    contentType,
  });
}

/** PUT du fichier vers l’URL signée (hors origine API — pas de credentials cookie). */
export async function putBlobToPresignedUrl(
  uploadUrl: string,
  blob: Blob,
  contentType: string,
): Promise<void> {
  const res = await fetchWithDiagnostics(uploadUrl, {
    method: "PUT",
    body: blob,
    headers: {
      "Content-Type": contentType,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(text || `Échec de l’upload (${res.status})`, res.status);
  }
}
