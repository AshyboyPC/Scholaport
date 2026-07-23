import { Camera, Crop, ImageUp, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { PoriAvatar } from "@/components/pori/PoriAvatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { notifyError, notifySuccess } from "@/lib/app-feedback";
import {
  getAcademicPassportPhotoUrl,
  removeAcademicPassportPhoto,
  uploadAcademicPassportPhoto,
} from "@/lib/academic-passport-api";
import type { AcademicPassportPreferences } from "@/lib/academic-passport";
import { useI18n } from "@/lib/i18n";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const SUPPORTED_PHOTOS = new Set(["image/jpeg", "image/png", "image/webp"]);

async function renderCrop(source: string, crop: Area) {
  const response = await fetch(source);
  if (!response.ok) throw new Error("Unable to open this image for cropping.");
  const sourceBlob = await response.blob();
  const sourceUrl = URL.createObjectURL(sourceBlob);
  try {
    const image = new Image();
    image.src = sourceUrl;
    await image.decode();
    const size = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser could not prepare this image.");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, size, size);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Unable to prepare this image."))),
        "image/webp",
        0.9,
      ),
    );
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

export function PassportIdentityEditor({
  userId,
  preferences,
  onChange,
}: {
  userId?: string;
  preferences: AcademicPassportPreferences;
  onChange: (next: AcademicPassportPreferences) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();
  const [preview, setPreview] = useState<string | null>(null);
  const [cropSource, setCropSource] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);
  const identity = preferences.identity;

  useEffect(() => {
    if (!identity.photoPath) return setPreview(null);
    let active = true;
    void getAcademicPassportPhotoUrl(identity.photoPath)
      .then((url) => active && setPreview(url))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [identity.photoPath]);

  const closeCropper = () => {
    if (cropSource?.startsWith("blob:")) URL.revokeObjectURL(cropSource);
    setCropSource(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropPixels(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const chooseFile = (selected?: File) => {
    if (!selected) return;
    if (!SUPPORTED_PHOTOS.has(selected.type))
      return notifyError("Choose a JPEG, PNG, or WebP image.");
    if (selected.size > MAX_PHOTO_BYTES) return notifyError("Choose an image smaller than 5 MB.");
    closeCropper();
    setCropSource(URL.createObjectURL(selected));
  };

  const saveCrop = async () => {
    if (!cropSource || !cropPixels || !userId) return;
    setSaving(true);
    try {
      const blob = await renderCrop(cropSource, cropPixels);
      const path = await uploadAcademicPassportPhoto(userId, blob);
      const url = await getAcademicPassportPhotoUrl(path);
      setPreview(url);
      onChange({
        ...preferences,
        identity: {
          ...identity,
          mode: "photo",
          photoPath: path,
          photoCrop: { zoom: 1, x: 50, y: 50 },
        },
      });
      closeCropper();
      notifySuccess("Cropped Passport photo saved privately.");
    } catch (cause) {
      notifyError(cause instanceof Error ? cause.message : "Unable to save this photo.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await removeAcademicPassportPhoto(identity.photoPath);
      setPreview(null);
      onChange({ ...preferences, identity: { ...identity, photoPath: null, mode: "pori" } });
      notifySuccess("Passport photo removed.", "remove");
    } catch (cause) {
      notifyError(cause instanceof Error ? cause.message : "Unable to remove this photo.");
    }
  };

  return (
    <fieldset className="passport-customizer__group passport-identity-editor">
      <legend>{t("Choose Your Passport Identity")}</legend>
      <div className="passport-identity-editor__modes">
        <button
          type="button"
          aria-pressed={identity.mode === "pori"}
          onClick={() => onChange({ ...preferences, identity: { ...identity, mode: "pori" } })}
        >
          <span>
            <PoriAvatar preferences={preferences.pori} context="mobile" />
          </span>
          <strong>{t("Use My Pori")}</strong>
        </button>
        <button
          type="button"
          aria-pressed={identity.mode === "photo"}
          onClick={() =>
            preview
              ? onChange({ ...preferences, identity: { ...identity, mode: "photo" } })
              : inputRef.current?.click()
          }
        >
          <span>{preview ? <img src={preview} alt="Your photo preview" /> : <Camera />}</span>
          <strong>{t("Use My Photo")}</strong>
        </button>
      </div>

      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => chooseFile(event.target.files?.[0])}
      />

      {identity.mode === "pori" ? (
        <div className="passport-identity-editor__action">
          <p>
            {preferences.pori.status === "complete"
              ? "Your customized Pori is ready."
              : "Default Pori is ready. Personalize it whenever you like."}
          </p>
          <a href="/pori">
            {preferences.pori.status === "complete" ? "Edit Pori" : "Customize Pori"}
          </a>
        </div>
      ) : (
        <div className="passport-photo-editor">
          <div className="passport-photo-editor__preview">
            {preview ? (
              <img src={preview} alt="Saved Passport portrait" />
            ) : (
              <Camera aria-hidden="true" />
            )}
          </div>
          <div className="passport-photo-editor__controls">
            <button type="button" onClick={() => inputRef.current?.click()}>
              <ImageUp /> {preview ? t("Replace photo") : t("Choose photo")}
            </button>
            {preview && (
              <button type="button" onClick={() => setCropSource(preview)}>
                <Crop /> {t("Adjust crop")}
              </button>
            )}
            {preview && (
              <button type="button" onClick={() => void remove()}>
                <Trash2 /> {t("Remove")}
              </button>
            )}
          </div>
          <small>
            Your photo is private and used only to personalize this Passport. It does not verify
            your identity.
          </small>
        </div>
      )}

      <Dialog open={Boolean(cropSource)} onOpenChange={(open) => !open && closeCropper()}>
        <DialogContent className="passport-crop-dialog">
          <DialogHeader>
            <DialogTitle>{t("Crop your Passport photo")}</DialogTitle>
            <DialogDescription>
              {t(
                "Drag to position your face inside the circle. The saved result is exactly what appears on your Passport.",
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="passport-crop-dialog__stage">
            {cropSource && (
              <Cropper
                image={cropSource}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                objectFit="cover"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_area, pixels) => setCropPixels(pixels)}
              />
            )}
          </div>
          <label className="passport-crop-dialog__zoom">
            <Minus aria-hidden="true" />
            <span className="sr-only">Zoom</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
            />
            <Plus aria-hidden="true" />
          </label>
          <DialogFooter className="passport-crop-dialog__actions">
            <button type="button" onClick={closeCropper}>
              {t("Cancel")}
            </button>
            <button
              type="button"
              disabled={saving || !cropPixels || !userId}
              onClick={() => void saveCrop()}
            >
              <Crop /> {saving ? t("Saving…") : t("Apply crop")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </fieldset>
  );
}
