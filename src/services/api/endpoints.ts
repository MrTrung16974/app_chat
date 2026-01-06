import { apiClient } from './client';
import type { Conversation, Message, User } from '@/types/models';

export const loginApi = async (email: string, password: string) => {
  const response = await apiClient.post<{ token: string; user: User }>(
    '/auth/login',
    { email, password },
  );
  return response.data;
};

export const meApi = async () => {
  const response = await apiClient.get<User>('/me');
  return response.data;
};

export const conversationsApi = async (page = 1, limit = 20) => {
  const response = await apiClient.get<{ data: Conversation[]; page: number; limit: number }>(
    `/conversations?page=${page}&limit=${limit}`,
  );
  return response.data;
};

export const messagesApi = async (conversationId: string, before?: string, limit = 20) => {
  const query = [`limit=${limit}`];
  if (before) query.push(`before=${encodeURIComponent(before)}`);
  const response = await apiClient.get<{ data: Message[]; conversationId: string }>(
    `/conversations/${conversationId}/messages?${query.join('&')}`,
  );
  return response.data;
};

export const sendMessageApi = async (conversationId: string, body: string) => {
  const response = await apiClient.post<Message>(`/conversations/${conversationId}/messages`, {
    body,
  });
  return response.data;
};

export const markReadApi = async (conversationId: string) => {
  const response = await apiClient.post(`/conversations/${conversationId}/read`);
  return response.data as { success: boolean };
};
