import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors, hitSlop, space } from '../theme';

type Props = {
  title: string;
  /** يُعرض يسار العنوان (مثلاً +) في واجهة RTL */
  leftAction?: ReactNode;
  showBack?: boolean;
};

export function TopBar({ title, leftAction, showBack = true }: Props) {
  const navigation = useNavigation();

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="رجوع"
            hitSlop={hitSlop}
            onPress={() => navigation.goBack()}
            style={styles.iconCircle}
          >
            <Ionicons name="chevron-forward" size={22} color={colors.text} />
          </Pressable>
        ) : (
          <View style={styles.iconCircleHidden} />
        )}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.side}>{leftAction ?? <View style={styles.iconCircleHidden} />}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderMuted,
    paddingBottom: space.sm + 2,
    marginBottom: space.md,
  },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: space.md,
    gap: space.sm,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  side: { minWidth: 40, alignItems: 'center', justifyContent: 'center' },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceMid,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleHidden: { width: 40, height: 40 },
});
