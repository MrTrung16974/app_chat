import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { List, Modal, Portal, Snackbar, Text, useTheme } from 'react-native-paper';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Composer } from '@/components/Composer';
import { EmptyState } from '@/components/EmptyState';
import { MessageBubble } from '@/components/MessageBubble';
import { useMessages } from '@/hooks/useMessages';
import { markReadApi } from '@/services/api/endpoints';
import { mockSocket } from '@/services/realtime/mockSocket';
import { useAuthStore } from '@/store/authStore';
import type { Message } from '@/types/models';
import type { RootStackParamList } from '@/types/navigation';

export const ChatDetailScreen = () => {
  const { colors } = useTheme();
  const route = useRoute<RouteProp<RootStackParamList, 'ChatDetail'>>();
  const { conversationId } = route.params;
  const user = useAuthStore((state) => state.user);
  const [input, setInput] = useState('');
  const [actionMessage, setActionMessage] = useState<Message | null>(null);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState('');
  const [online, setOnline] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { messagesQuery, sendMutation } = useMessages(conversationId, user?.id ?? '');

  const messages = useMemo(() => {
    const all = messagesQuery.data?.pages.flatMap((page) => page.data) ?? [];
    return all.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [messagesQuery.data]);

  useFocusEffect(
    useCallback(() => {
      markReadApi(conversationId).catch(() => null);
      const unsubscribe = mockSocket.on('typing', (payload) => {
        if (payload.conversationId === conversationId) {
          setTyping(true);
          setTimeout(() => setTyping(false), 1500);
        }
      });
      const unsubscribeOnline = mockSocket.on('online', (payload) => {
        if (payload.userId !== user?.id) {
          setOnline(payload.status === 'online');
        }
      });
      return () => {
        unsubscribe();
        unsubscribeOnline();
      };
    }, [conversationId, user?.id]),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.onlineBadge}>
          <View style={[styles.dot, { backgroundColor: online ? '#3DDC84' : '#A0A4AE' }]} />
          <Text style={{ color: colors.outline }}>{online ? 'online' : 'offline'}</Text>
        </View>
      ),
    });
  }, [colors.outline, navigation, online]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      await sendMutation.mutateAsync(input.trim());
      setInput('');
    } catch (err) {
      setError('Message failed. Please retry.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}
    >
      {messages.length === 0 ? (
        <EmptyState
          title="No messages yet"
          subtitle="Start the conversation with a friendly hello."
        />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          inverted
          onEndReachedThreshold={0.2}
          onEndReached={() => {
            if (messagesQuery.hasNextPage && !messagesQuery.isFetchingNextPage) {
              messagesQuery.fetchNextPage();
            }
          }}
          renderItem={({ item }) => (
            <Pressable onLongPress={() => setActionMessage(item)}>
              <MessageBubble message={item} isMine={item.senderId === user?.id} />
            </Pressable>
          )}
          ListFooterComponent={
            messagesQuery.isFetchingNextPage ? (
              <Text style={styles.loadingOlder}>Loading older messages...</Text>
            ) : null
          }
        />
      )}
      {typing ? (
        <Text style={[styles.typing, { color: colors.outline }]}>Typing...</Text>
      ) : null}
      <Composer value={input} onChange={setInput} onSend={handleSend} disabled={sendMutation.isPending} />
      <Portal>
        <Modal
          visible={Boolean(actionMessage)}
          onDismiss={() => setActionMessage(null)}
          contentContainerStyle={[styles.actionSheet, { backgroundColor: colors.surface }]}
        >
          <List.Section title="Message actions">
            <List.Item title="Copy" onPress={() => setActionMessage(null)} />
            <List.Item title="Reply" onPress={() => setActionMessage(null)} />
            <List.Item title="Delete" onPress={() => setActionMessage(null)} />
          </List.Section>
        </Modal>
      </Portal>
      <Snackbar visible={Boolean(error)} onDismiss={() => setError('')} duration={2000}>
        {error}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  typing: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  loadingOlder: {
    textAlign: 'center',
    marginVertical: 16,
  },
  actionSheet: {
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
