import React, { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Searchbar, Snackbar, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChatListItem } from '@/components/ChatListItem';
import { EmptyState } from '@/components/EmptyState';
import { SkeletonList } from '@/components/Loading';
import { useConversations } from '@/hooks/useConversations';
import type { RootStackParamList } from '@/types/navigation';

export const ChatsScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data, isLoading, refetch, isFetching, error } = useConversations();
  const [search, setSearch] = useState('');

  const conversations = data?.data ?? [];
  const filtered = useMemo(() => {
    if (!search) return conversations;
    return conversations.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [conversations, search]);

  if (isLoading) {
    return <SkeletonList />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text variant="headlineSmall">Chats</Text>
        <Text style={{ color: colors.outline }}>Stay close to your team</Text>
      </View>
      <Searchbar
        placeholder="Search"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        renderItem={({ item }) => (
          <ChatListItem
            conversation={item}
            onPress={() =>
              navigation.navigate('ChatDetail', {
                conversationId: item.id,
                title: item.title,
              })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No conversations"
            subtitle="Start a new chat or check back later."
            actionLabel="Refresh"
            onAction={() => refetch()}
          />
        }
      />
      <Snackbar visible={Boolean(error)} onDismiss={() => {}} duration={2000}>
        Something went wrong. Pull to refresh.
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 4,
  },
  search: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
  },
});
