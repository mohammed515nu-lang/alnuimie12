import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';

import { navigateFromRoot } from '../../navigation/rootNavigation';
import { useStore } from '../../store/useStore';
import { getApiErrorMessage } from '../../api/http';
import type { ChatThread } from '../../api/types';
import type { RootStackParamList } from '../../navigation/types';
import { colors, pressableRipple, radius, space, touch } from '../../theme';

type Nav = NavigationProp<RootStackParamList> & NavigationProp<ParamListBase>;

export function ChatListScreen() {
  const navigation = useNavigation<Nav>();
  const refreshChatThreads = useStore((s) => s.refreshChatThreads);
  const refreshConnections = useStore((s) => s.refreshConnections);
  const threads = useStore((s) => s.chatThreads);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const load = useCallback(async () => {
    setError(null);
    await Promise.all([refreshChatThreads(), refreshConnections()]);
  }, [refreshChatThreads, refreshConnections]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await load();
      } catch (e) {
        setError(getApiErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setRefreshing(false);
    }
  };

  const filtered = threads.filter((t) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return (t.otherUserName ?? '').toLowerCase().includes(s);
  });

  const renderItem = ({ item }: { item: ChatThread }) => (
    <Pressable
      accessibilityRole="button"
      style={styles.row}
      onPress={() => navigation.navigate('ChatRoom', { conversationId: item.id, title: item.otherUserName })}
      {...pressableRipple(colors.primaryTint12)}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.otherUserName}</Text>
        <Text style={styles.last} numberOfLines={1}>
          {item.lastMessage ?? '—'}
        </Text>
      </View>
      {item.unread > 0 ? (
        <View style={styles.badge} accessibilityLabel={`${item.unread} غير مقروء`}>
          <Text style={styles.badgeText}>{item.unread > 99 ? '99+' : item.unread}</Text>
        </View>
      ) : (
        <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
      )}
    </Pressable>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center} edges={['top']}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.head}>
        <Pressable style={styles.searchBtn} {...pressableRipple(colors.primaryTint12)}>
          <Ionicons name="search" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.pageTitle}>المحادثات</Text>
        <View style={{ width: 44 }} />
      </View>
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={colors.textMuted} style={{ marginLeft: space.sm }} />
        <TextInput
          placeholder="ابحث في المحادثات..."
          placeholderTextColor={colors.placeholder}
          style={styles.searchInput}
          value={q}
          onChangeText={setQ}
          textAlign="right"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(x) => x.id}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={
          threads.length === 0 && !q.trim() ? [styles.listContent, styles.emptyGrow] : styles.listContent
        }
        ListHeaderComponent={
          error ? (
            <View style={styles.errWrap}>
              <Text style={styles.error}>{error}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => void onRefresh()}
                {...pressableRipple(colors.primaryTint12)}
                style={styles.retry}
              >
                <Text style={styles.retryText}>إعادة المحاولة</Text>
              </Pressable>
            </View>
          ) : null
        }
        ListEmptyComponent={
          threads.length === 0 ? (
            <View style={styles.emptyBlock}>
              <Ionicons name="chatbubbles-outline" size={80} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>لا توجد محادثات</Text>
              <Text style={styles.emptySub}>ابحث عن مستخدم لبدء محادثة جديدة</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigateFromRoot(navigation, 'DiscoverUsers')}
                {...pressableRipple(colors.primaryTint12)}
                style={styles.cta}
              >
                <Ionicons name="search" size={20} color={colors.onPrimary} style={{ marginLeft: space.sm }} />
                <Text style={styles.ctaText}>ابدأ محادثة</Text>
              </Pressable>
            </View>
          ) : q.trim() ? (
            <Text style={styles.noMatch}>لا توجد نتائج مطابقة</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  head: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: space.md,
    marginBottom: space.sm,
  },
  pageTitle: { flex: 1, textAlign: 'right', color: colors.text, fontSize: 22, fontWeight: '900' },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceMid,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginHorizontal: space.lg,
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    paddingHorizontal: space.md,
    marginBottom: space.md,
  },
  searchInput: { flex: 1, paddingVertical: space.md, color: colors.text, minHeight: touch.minHeight - 6 },
  listContent: { paddingHorizontal: space.lg, paddingBottom: space.xxl + 6 },
  emptyGrow: { flexGrow: 1 },
  errWrap: { marginBottom: space.sm + 2 },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    backgroundColor: colors.surfaceMid,
    marginBottom: space.sm + 2,
    minHeight: touch.minHeight + 4,
    gap: space.md,
  },
  name: { color: colors.text, fontWeight: '900', textAlign: 'right' },
  last: { color: colors.textMuted, marginTop: space.sm - 2, textAlign: 'right' },
  badge: {
    minWidth: 28,
    minHeight: 28,
    borderRadius: 14,
    backgroundColor: colors.notification,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.sm,
  },
  badgeText: { color: colors.onPrimary, fontWeight: '900', fontSize: 12 },
  emptyBlock: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: space.xxl * 2, paddingBottom: 80 },
  emptyTitle: { color: colors.textMuted, fontSize: 17, fontWeight: '800', marginTop: space.lg },
  emptySub: { color: colors.placeholder, marginTop: space.sm, textAlign: 'center', paddingHorizontal: space.xl },
  cta: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: space.xl,
    backgroundColor: colors.primary,
    paddingHorizontal: space.xxl,
    paddingVertical: space.md,
    borderRadius: radius.lg,
    minHeight: touch.minHeight,
  },
  ctaText: { color: colors.onPrimary, fontWeight: '900', fontSize: 16 },
  error: { color: colors.error, textAlign: 'center' },
  retry: {
    marginTop: space.sm + 2,
    alignSelf: 'center',
    paddingHorizontal: space.md - 2,
    paddingVertical: space.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    minHeight: touch.minHeight - 4,
    justifyContent: 'center',
  },
  retryText: { color: colors.textSecondary, fontWeight: '800' },
  noMatch: { color: colors.placeholder, textAlign: 'center', marginTop: space.lg },
});
