import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import type { Message } from '@/types/models';
import { formatTime } from '@/utils/date';

export const MessageBubble = ({
  message,
  isMine,
}: {
  message: Message;
  isMine: boolean;
}) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, isMine ? styles.alignEnd : styles.alignStart]}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isMine ? colors.primary : colors.surface,
            borderColor: colors.outline,
          },
          isMine ? styles.mine : styles.theirs,
        ]}
      >
        <Text style={{ color: isMine ? '#fff' : colors.onSurface }}>{message.body}</Text>
        <View style={styles.meta}>
          <Text style={[styles.time, { color: isMine ? '#E6EEFF' : colors.outline }]}>
            {formatTime(message.createdAt)}
          </Text>
          {isMine && message.status ? (
            <Text style={[styles.status, { color: isMine ? '#E6EEFF' : colors.outline }]}>
              {message.status}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  mine: {
    borderTopRightRadius: 4,
  },
  theirs: {
    borderTopLeftRadius: 4,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
    gap: 8,
  },
  time: {
    fontSize: 11,
  },
  status: {
    fontSize: 11,
    textTransform: 'capitalize',
  },
});
