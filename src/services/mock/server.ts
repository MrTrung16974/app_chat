import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { Conversation, Message, User } from '@/types/models';
import { conversations, messagesByConversation, users } from './seed';
import { createId } from '@/utils/id';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const randomDelay = () => 300 + Math.random() * 500;

const shouldError = () => Math.random() < 0.07;

const getUserFromToken = (token?: string | null) =>
  token ? users.find((user) => user.id === 'user_1') ?? null : null;

const getConversationsPage = (page = 1, limit = 20): Conversation[] => {
  const start = (page - 1) * limit;
  return conversations.slice(start, start + limit);
};

const getMessagesPage = (conversationId: string, before?: string, limit = 20): Message[] => {
  const messages = messagesByConversation[conversationId] ?? [];
  const filtered = before
    ? messages.filter((msg) => new Date(msg.createdAt).getTime() < new Date(before).getTime())
    : messages;
  return filtered.slice(-limit);
};

const updateConversationLastMessage = (conversationId: string) => {
  const message = messagesByConversation[conversationId].at(-1) ?? null;
  const conversation = conversations.find((item) => item.id === conversationId);
  if (conversation) {
    conversation.lastMessage = message;
    conversation.unreadCount = 0;
  }
};

const createResponse = <T>(data: T, config: AxiosRequestConfig, status = 200): AxiosResponse<T> => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config,
});

const parseUrl = (url = '') => {
  const cleaned = url.replace(/^\/api/, '');
  const [path, queryString] = cleaned.split('?');
  const params = new URLSearchParams(queryString);
  return { path, params };
};

export const mockServer = {
  async handle(config: AxiosRequestConfig): Promise<AxiosResponse> {
    await delay(randomDelay());
    if (shouldError()) {
      return Promise.reject({
        response: createResponse({ message: 'Random network error' }, config, 500),
      });
    }

    const method = (config.method ?? 'get').toLowerCase();
    const { path, params } = parseUrl(config.url);
    const token = (config.headers?.Authorization as string | undefined)?.replace('Bearer ', '');
    const user = getUserFromToken(token);

    if (path === '/auth/login' && method === 'post') {
      const payload = config.data ? JSON.parse(config.data as string) : {};
      const loginUser = users.find((item) => item.email === payload.email) ?? users[0];
      return createResponse({ token: 'mock-token', user: loginUser }, config);
    }

    if (path === '/me' && method === 'get') {
      if (!user) {
        return Promise.reject({ response: createResponse({ message: 'Unauthorized' }, config, 401) });
      }
      return createResponse(user, config);
    }

    if (path === '/conversations' && method === 'get') {
      const page = Number(params.get('page') ?? '1');
      const limit = Number(params.get('limit') ?? '20');
      return createResponse({ data: getConversationsPage(page, limit), page, limit }, config);
    }

    const conversationMatch = path?.match(/\/conversations\/(.+?)(?:\/messages|\/read)?$/);
    if (conversationMatch) {
      const conversationId = conversationMatch[1];
      if (path.endsWith('/messages') && method === 'get') {
        const before = params.get('before') ?? undefined;
        const limit = Number(params.get('limit') ?? '20');
        return createResponse(
          {
            data: getMessagesPage(conversationId, before, limit),
            conversationId,
          },
          config,
        );
      }

      if (path.endsWith('/messages') && method === 'post') {
        const payload = config.data ? JSON.parse(config.data as string) : {};
        const newMessage: Message = {
          id: createId('msg'),
          conversationId,
          senderId: user?.id ?? 'user_1',
          body: payload.body ?? '',
          createdAt: new Date().toISOString(),
          status: 'sent',
        };
        messagesByConversation[conversationId] = [
          ...(messagesByConversation[conversationId] ?? []),
          newMessage,
        ];
        updateConversationLastMessage(conversationId);
        return createResponse(newMessage, config, 201);
      }

      if (path.endsWith('/read') && method === 'post') {
        const conversation = conversations.find((item) => item.id === conversationId);
        if (conversation) {
          conversation.unreadCount = 0;
        }
        return createResponse({ success: true }, config);
      }
    }

    return Promise.reject({ response: createResponse({ message: 'Not found' }, config, 404) });
  },
};
