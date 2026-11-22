import api from './api';

export interface AppointmentAttachment {
  id: number;
  appointment_id: number;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  created_at: string;
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB (mesmo limite do backend)

export const getAttachments = async (appointmentId: string | number): Promise<AppointmentAttachment[]> => {
  const response = await api.get(`/appointments/${appointmentId}/attachments`);
  return response.data;
};

export const uploadAttachments = async (
  appointmentId: string | number,
  files: File[],
  onProgress?: (percent: number) => void
): Promise<AppointmentAttachment[]> => {
  const form = new FormData();
  files.forEach(file => form.append('files[]', file));

  const response = await api.post(`/appointments/${appointmentId}/attachments`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: e => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
    },
  });
  return response.data;
};

export const deleteAttachment = async (id: number): Promise<void> => {
  await api.delete(`/attachments/${id}`);
};

/** O storage é privado: a imagem é buscada pela API (com token) e exibida via blob. */
export const fetchAttachmentBlob = async (url: string): Promise<Blob> => {
  const response = await api.get(url, { responseType: 'blob' });
  return response.data;
};
