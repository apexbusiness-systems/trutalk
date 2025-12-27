import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEngagementStore } from '@/stores/engagement';
import * as Haptics from 'expo-haptics';

export function DailyChallengeCard() {
  const { dailyChallenge, completedToday, completeChallenge } = useEngagementStore();

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Navigate to recording screen or trigger recording
  };

  return (
    <View style={[styles.container, completedToday && styles.completed]}>
      <View style={styles.header}>
        <Ionicons name="trophy" size={24} color={completedToday ? '#22c55e' : '#f59e0b'} />
        <Text style={styles.title}>Daily Challenge</Text>
      </View>

      <Text style={styles.challenge}>{dailyChallenge}</Text>

      {completedToday ? (
        <View style={styles.completedBadge}>
          <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
          <Text style={styles.completedText}>Completed!</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Ionicons name="mic" size={20} color="#fff" />
          <Text style={styles.buttonText}>Start Recording</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#1a1a1a', borderRadius: 16, padding: 20, marginHorizontal: 24, marginTop: 16, borderWidth: 2, borderColor: '#f59e0b' },
  completed: { borderColor: '#22c55e' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 18, fontWeight: '700', color: '#fff', marginLeft: 8 },
  challenge: { fontSize: 16, color: '#e5e5e5', marginBottom: 16, lineHeight: 24 },
  button: { backgroundColor: '#3b82f6', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  completedBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12 },
  completedText: { color: '#22c55e', fontSize: 16, fontWeight: '600', marginLeft: 8 },
});
