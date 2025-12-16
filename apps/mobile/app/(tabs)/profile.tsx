import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'expo-router';

interface UserStats {
  streakCount: number;
  totalMatches: number;
  echoChips: number;
  totalCalls: number;
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats>({
    streakCount: 0,
    totalMatches: 0,
    echoChips: 0,
    totalCalls: 0,
  });

  useEffect(() => {
    // TODO: Fetch user stats from API
    setStats({
      streakCount: 7,
      totalMatches: 12,
      echoChips: 150,
      totalCalls: 8,
    });
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color="#fff" />
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{user?.email?.split('@')[0] || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#fbbf2420' }]}>
            <Ionicons name="flame" size={24} color="#fbbf24" />
          </View>
          <Text style={styles.statValue}>{stats.streakCount}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#ec489920' }]}>
            <Ionicons name="heart" size={24} color="#ec4899" />
          </View>
          <Text style={styles.statValue}>{stats.totalMatches}</Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#3b82f620' }]}>
            <Ionicons name="diamond" size={24} color="#3b82f6" />
          </View>
          <Text style={styles.statValue}>{stats.echoChips}</Text>
          <Text style={styles.statLabel}>Echo Chips</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#10b98120' }]}>
            <Ionicons name="call" size={24} color="#10b981" />
          </View>
          <Text style={styles.statValue}>{stats.totalCalls}</Text>
          <Text style={styles.statLabel}>Calls</Text>
        </View>
      </View>

      {/* Streak Visualization */}
      {stats.streakCount > 0 && (
        <View style={styles.streakSection}>
          <Text style={styles.sectionTitle}>Your Streak</Text>
          <View style={styles.streakVisualization}>
            {Array.from({ length: Math.min(stats.streakCount, 7) }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.streakDay,
                  { backgroundColor: i < stats.streakCount ? '#fbbf24' : '#333' },
                ]}
              >
                <Ionicons
                  name="flame"
                  size={16}
                  color={i < stats.streakCount ? '#fff' : '#666'}
                />
              </View>
            ))}
          </View>
          <Text style={styles.streakText}>
            {stats.streakCount} day{stats.streakCount > 1 ? 's' : ''} in a row! Keep it up! 🔥
          </Text>
        </View>
      )}

      {/* Echo Chips Display */}
      <View style={styles.chipsSection}>
        <View style={styles.chipsHeader}>
          <View style={styles.chipsIconContainer}>
            <Ionicons name="diamond" size={24} color="#3b82f6" />
          </View>
          <View style={styles.chipsInfo}>
            <Text style={styles.chipsValue}>{stats.echoChips}</Text>
            <Text style={styles.chipsLabel}>Echo Chips</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.buyChipsButton}>
          <Text style={styles.buyChipsText}>Buy More Chips</Text>
          <Ionicons name="arrow-forward" size={16} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Settings */}
      <View style={styles.settingsSection}>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="notifications-outline" size={20} color="#fff" />
          <Text style={styles.settingText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="language-outline" size={20} color="#fff" />
          <Text style={styles.settingText}>Language</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="help-circle-outline" size={20} color="#fff" />
          <Text style={styles.settingText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={[styles.settingText, { color: '#ef4444' }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  contentContainer: {
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#0a0a0a',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#999',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  streakSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  streakVisualization: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  streakDay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  chipsSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    marginTop: 0,
  },
  chipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  chipsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f620',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chipsInfo: {
    flex: 1,
  },
  chipsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  chipsLabel: {
    fontSize: 12,
    color: '#999',
  },
  buyChipsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 8,
  },
  buyChipsText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  settingsSection: {
    margin: 16,
    marginTop: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
  },
});

