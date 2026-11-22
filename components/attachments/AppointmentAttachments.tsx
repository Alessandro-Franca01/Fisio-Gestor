import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '../Icon';
import {
  ALLOWED_IMAGE_TYPES,
  AppointmentAttachment,
  MAX_IMAGE_SIZE,
  deleteAttachment,
  fetchAttachmentBlob,
  getAttachments,
  uploadAttachments,
} from '../../services/attachmentService';

/** Carrega a imagem pela API autenticada e devolve uma URL local (blob). */
const useAttachmentImage = (url: string) => {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;
    fetchAttachmentBlob(url)
      .then(blob => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  return { src, failed };
};

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const Thumbnail: React.FC<{
  attachment: AppointmentAttachment;
  readOnly: boolean;
  onOpen: (src: string, name: string) => void;
  onDelete: (a: AppointmentAttachment) => void;
}> = ({ attachment, readOnly, onOpen, onDelete }) => {
  const { src, failed } = useAttachmentImage(attachment.url);

  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
      {src ? (
        <button
          type="button"
          onClick={() => onOpen(src, attachment.original_name)}
          className="h-full w-full"
          title={attachment.original_name}
        >
          <img src={src} alt={attachment.original_name} className="h-full w-full object-cover" />
        </button>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-subtle-light dark:text-subtle-dark">
          <Icon name={failed ? 'broken_image' : 'image'} className={`text-3xl ${failed ? '' : 'animate-pulse'}`} />
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 text-[11px] text-white">
        <p className="truncate">{attachment.original_name}</p>
        <p className="opacity-80">{formatSize(attachment.size)}</p>
      </div>

      {!readOnly && (
        <button
          type="button"
          onClick={() => onDelete(attachment)}
          className="absolute right-1.5 top-1.5 flex size-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100 focus:opacity-100"
          title="Remover foto"
        >
          <Icon name="delete" className="text-base" />
        </button>
      )}
    </div>
  );
};

interface Props {
  appointmentId: string | number;
  /** Somente leitura: lista e amplia as fotos, sem enviar nem remover. */
  readOnly?: boolean;
}

export const AppointmentAttachments: React.FC<Props> = ({ appointmentId, readOnly = false }) => {
  const [attachments, setAttachments] = useState<AppointmentAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<{ src: string; name: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAttachments(appointmentId)
      .then(data => !cancelled && setAttachments(data))
      .catch(() => !cancelled && setError('Não foi possível carregar as fotos.'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [appointmentId]);

  const handleFiles = useCallback(
    async (list: FileList | File[]) => {
      const files = Array.from(list);
      if (!files.length) return;
      setError(null);

      const invalid = files.find(f => !ALLOWED_IMAGE_TYPES.includes(f.type));
      if (invalid) return setError(`"${invalid.name}" não é uma imagem PNG, JPG, GIF ou WEBP.`);
      const tooBig = files.find(f => f.size > MAX_IMAGE_SIZE);
      if (tooBig) return setError(`"${tooBig.name}" ultrapassa o limite de 10MB.`);

      try {
        setProgress(0);
        const created = await uploadAttachments(appointmentId, files, setProgress);
        setAttachments(prev => [...prev, ...created]);
      } catch (err: any) {
        const errors = err?.response?.data?.errors;
        setError(
          errors ? (Object.values(errors).flat() as string[]).join(' ') : err?.response?.data?.message || 'Erro ao enviar as fotos.'
        );
      } finally {
        setProgress(null);
        if (inputRef.current) inputRef.current.value = '';
      }
    },
    [appointmentId]
  );

  const handleDelete = async (attachment: AppointmentAttachment) => {
    if (!window.confirm(`Remover a foto "${attachment.original_name}"?`)) return;
    try {
      await deleteAttachment(attachment.id);
      setAttachments(prev => prev.filter(a => a.id !== attachment.id));
    } catch {
      setError('Erro ao remover a foto.');
    }
  };

  const uploading = progress !== null;

  return (
    <div>
      {!readOnly && (
        <div
          onDragOver={e => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault();
            setDragging(false);
            if (!uploading) handleFiles(e.dataTransfer.files);
          }}
          className={`mt-5 flex justify-center rounded-lg border-2 border-dashed px-6 py-8 transition-colors ${
            dragging ? 'border-primary bg-primary/5' : 'border-border-light dark:border-border-dark'
          }`}
        >
          <div className="text-center">
            <Icon name="upload_file" className="text-5xl text-subtle-light dark:text-subtle-dark" />
            <div className="mt-3 flex justify-center text-sm leading-6 text-subtle-light dark:text-subtle-dark">
              <label className="relative cursor-pointer rounded-md font-semibold text-primary hover:underline">
                <span>Clique para selecionar</span>
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  accept={ALLOWED_IMAGE_TYPES.join(',')}
                  disabled={uploading}
                  onChange={e => e.target.files && handleFiles(e.target.files)}
                  className="sr-only"
                />
              </label>
              <p className="pl-1">ou arraste as fotos aqui</p>
            </div>
            <p className="text-xs leading-5 text-subtle-light dark:text-subtle-dark">PNG, JPG, GIF ou WEBP até 10MB cada</p>

            {uploading && (
              <div className="mx-auto mt-3 w-56">
                <div className="h-2 overflow-hidden rounded-full bg-primary/20">
                  <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-1 text-xs text-subtle-light dark:text-subtle-dark">Enviando... {progress}%</p>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <Icon name="error" className="text-base" /> {error}
        </p>
      )}

      {loading ? (
        <p className="mt-4 text-sm text-subtle-light dark:text-subtle-dark">Carregando fotos...</p>
      ) : attachments.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {attachments.map(a => (
            <Thumbnail
              key={a.id}
              attachment={a}
              readOnly={readOnly}
              onOpen={(src, name) => setPreview({ src, name })}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        readOnly && <p className="mt-4 text-sm text-subtle-light dark:text-subtle-dark">Nenhuma foto anexada.</p>
      )}

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreview(null)}
          role="dialog"
          aria-label={preview.name}
        >
          <button
            type="button"
            className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setPreview(null)}
          >
            <Icon name="close" />
          </button>
          <img src={preview.src} alt={preview.name} className="max-h-full max-w-full rounded-lg object-contain" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};
