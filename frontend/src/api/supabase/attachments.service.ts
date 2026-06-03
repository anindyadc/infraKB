import { supabase } from '../../lib/supabase';
import { IAttachmentsService } from '../types';

export const attachmentsService: IAttachmentsService = {
  upload: async (file, docId) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${docId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('attachments')
      .getPublicUrl(filePath);

    const { data, error } = await supabase
      .from('attachments')
      .insert({
        doc_id: docId,
        filename: file.name,
        stored_name: fileName,
        mime_type: file.type,
        size_bytes: file.size,
        url: publicUrl,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      markdownEmbed: `![${data.filename}](${data.url})`
    };
  },
  delete: async (id) => {
    const { data: attachment, error: fetchError } = await supabase
      .from('attachments')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete from storage
    const filePath = `${attachment.doc_id}/${attachment.stored_name}`;
    await supabase.storage.from('attachments').remove([filePath]);

    const { error } = await supabase.from('attachments').delete().eq('id', id);
    if (error) throw error;
    return { deleted: true };
  },
};
