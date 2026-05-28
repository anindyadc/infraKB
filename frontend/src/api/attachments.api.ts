import { attachmentsService as expressAttachments } from './express/attachments.service';
import { attachmentsService as supabaseAttachments } from './supabase/attachments.service';
import { IAttachmentsService } from './types';

const backendType = import.meta.env.VITE_BACKEND_TYPE;

export const attachmentsService: IAttachmentsService = backendType === 'supabase' ? supabaseAttachments : expressAttachments;

export const uploadAttachment = attachmentsService.upload;
export const deleteAttachment = attachmentsService.delete;
 Broadway