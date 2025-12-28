import { View, Text, StyleSheet } from 'react-native';
import { useEngagementStore } from '@/stores/engagement';

export function StreakBadge() {
  const { streak } = useEngagementStore();

  if (streak === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔥</Text>
      <Text style={styles.count}>{streak}</Text>
      <Text style={styles.label}>day streak</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f97316',
  },
  emoji: { fontSize: 32, marginBottom: 4 },
  count: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  label: { fontSize: 12, color: '#999', marginTop: 4 },
});
