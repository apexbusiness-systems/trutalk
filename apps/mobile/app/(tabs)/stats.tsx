import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StatsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Stats</Text>
        <Text style={styles.subtitle}>Track your journey</Text>
      </View>

      <StatCard
        icon="heart"
        title="Total Matches"
        value="23"
        change="+5 this week"
        color="#ec4899"
      />

      <StatCard
        icon="chatbubbles"
        title="Conversations"
        value="15"
        change="+3 this week"
        color="#3b82f6"
      />

      <StatCard
        icon="time"
        title="Avg Call Duration"
        value="8m 32s"
        change="+2m vs last week"
        color="#22c55e"
      />

      <StatCard
        icon="trophy"
        title="Compatibility Score"
        value="87%"
        change="Top 15%"
        color="#f59e0b"
      />
    </ScrollView>
  );
}

function StatCard({ icon, title, value, change, color }: any) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardChange}>{change}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { padding: 24, paddingTop: 60 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 16, color: '#999', marginTop: 4 },
  card: { backgroundColor: '#1a1a1a', borderRadius: 16, padding: 20, marginHorizontal: 24, marginTop: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 16, color: '#e5e5e5', marginLeft: 8, fontWeight: '600' },
  cardValue: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  cardChange: { fontSize: 14, color: '#22c55e' },
});
