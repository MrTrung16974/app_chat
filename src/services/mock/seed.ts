import type { Conversation, Message, User } from '@/types/models';
import { createId } from '@/utils/id';
import { subtractMinutes } from '@/utils/date';

const baseTime = new Date();

export const users: User[] = [
  {
    id: 'user_1',
    name: 'You',
    email: 'you@example.com',
    avatar: 'https://i.pravatar.cc/150?img=32',
    status: 'online',
  },
  {
    id: 'user_2',
    name: 'Ava Nguyen',
    email: 'ava@example.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
    status: 'online',
  },
  {
    id: 'user_3',
    name: 'Minh Tran',
    email: 'minh@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'offline',
  },
  {
    id: 'user_4',
    name: 'Nora Le',
    email: 'nora@example.com',
    avatar: 'https://i.pravatar.cc/150?img=44',
    status: 'online',
  },
];

const initialMessages = (conversationId: string, senderId: string): Message[] => [
  {
    id: createId('msg'),
    conversationId,
    senderId,
    body: 'Hello! Ready for our design sync?',
    createdAt: subtractMinutes(baseTime, 120),
    status: 'sent',
  },
  {
    id: createId('msg'),
    conversationId,
    senderId: 'user_1',
    body: 'Yes! I drafted a few ideas for the chat bubble styles.',
    createdAt: subtractMinutes(baseTime, 117),
    status: 'sent',
  },
  {
    id: createId('msg'),
    conversationId,
    senderId,
    body: 'Awesome. Can you share the palette you picked?',
    createdAt: subtractMinutes(baseTime, 112),
    status: 'sent',
  },
];

export const conversations: Conversation[] = [
  {
    id: 'conv_1',
    title: 'Ava Nguyen',
    avatar: users[1].avatar,
    participants: [users[0], users[1]],
    unreadCount: 2,
    lastMessage: null,
  },
  {
    id: 'conv_2',
    title: 'Minh Tran',
    avatar: users[2].avatar,
    participants: [users[0], users[2]],
    unreadCount: 0,
    lastMessage: null,
  },
  {
    id: 'conv_3',
    title: 'Nora Le',
    avatar: users[3].avatar,
    participants: [users[0], users[3]],
    unreadCount: 1,
    lastMessage: null,
  },
];

export const messagesByConversation: Record<string, Message[]> = {
  conv_1: initialMessages('conv_1', 'user_2'),
  conv_2: initialMessages('conv_2', 'user_3'),
  conv_3: initialMessages('conv_3', 'user_4'),
};

Object.values(messagesByConversation).forEach((messages) => {
  messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
});

conversations.forEach((conversation) => {
  const lastMessage = messagesByConversation[conversation.id].at(-1) ?? null;
  conversation.lastMessage = lastMessage;
});
