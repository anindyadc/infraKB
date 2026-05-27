import client from './client';

export const uploadAttachment = async (file: File, docId: number) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('docId', docId.toString());

  const { data } = await client.post('/attachments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

export const deleteAttachment = async (id: number) => {
  const { data } = await client.delete(`/attachments/${id}`);
  return data.data;
};
