export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ChatDetail: { conversationId: string; title: string };
};

export type AuthStackParamList = {
  Login: undefined;
};

export type MainTabParamList = {
  Chats: undefined;
  Settings: undefined;
};
