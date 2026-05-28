import client from '../client';
import { IAttachmentsService } from '../types';

export const attachmentsService: IAttachmentsService = {
  upload: async (file, docId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docId', docId.toString());

    const { data } = await client.post('/attachments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },
  delete: async (id) => {
    const { data } = await client.delete(`/attachments/${id}`);
    return data.data;
  },
};
 Broadway