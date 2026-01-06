import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Badge, Text, TouchableRipple, useTheme } from 'react-native-paper';
import type { Conversation } from '@/types/models';
import { formatDay } from '@/utils/date';

export const ChatListItem = ({
  conversation,
  onPress,
}: {
  conversation: Conversation;
  onPress: () => void;
}) => {
  const { colors } = useTheme();
  return (
    <TouchableRipple onPress={onPress} style={styles.card} borderless>
      <View style={styles.row}
      >
        <Avatar.Image size={52} source={{ uri: conversation.avatar }} />
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text variant="titleMedium" numberOfLines={1}>
              {conversation.title}
            </Text>
            {conversation.lastMessage ? (
              <Text style={{ color: colors.outline }}>
                {formatDay(conversation.lastMessage.createdAt)}
              </Text>
            ) : null}
          </View>
          <View style={styles.footerRow}>
            <Text numberOfLines={1} style={{ color: colors.outline, flex: 1 }}>
              {conversation.lastMessage?.body ?? 'No messages yet'}
            </Text>
            {conversation.unreadCount > 0 ? (
              <Badge style={styles.badge}>{conversation.unreadCount}</Badge>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    alignSelf: 'center',
  },
});
