export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline';
};

export type Conversation = {
  id: string;
  title: string;
  avatar: string;
  lastMessage: Message | null;
  unreadCount: number;
  participants: User[];
};

export type MessageStatus = 'sending' | 'sent' | 'failed';

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  status?: MessageStatus;
};
