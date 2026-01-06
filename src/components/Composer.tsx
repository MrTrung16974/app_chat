import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, TextInput, useTheme } from 'react-native-paper';

export const Composer = ({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
}) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <IconButton icon="emoticon-outline" onPress={() => {}} />
      <TextInput
        mode="flat"
        placeholder="Type a message"
        value={value}
        onChangeText={onChange}
        style={styles.input}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
      />
      <IconButton icon="paperclip" onPress={() => {}} />
      <IconButton icon="send" onPress={onSend} disabled={disabled} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
