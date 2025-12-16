import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VoiceRecorder } from '@/components/voice/VoiceRecorder';
import { useRouter } from 'expo-router';

interface MatchStatus {
  status: 'idle' | 'recording' | 'processing' | 'matching' | 'found';
  matchId?: string;
  similarity?: number;
}

export default function MatchScreen() {
  const router = useRouter();
  const [matchStatus, setMatchStatus] = useState<MatchStatus>({ status: 'idle' });

  const handleStartCall = () => {
    if (matchStatus.matchId) {
      router.push(`/call/${matchStatus.matchId}`);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Your Match</Text>
        <Text style={styles.subtitle}>Record a voice clip to connect</Text>
      </View>

      <View style={styles.recorderSection}>
        <VoiceRecorder />
      </View>

      {/* Match Status */}
      {matchStatus.status === 'processing' && (
        <View style={styles.statusCard}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.statusText}>Processing your voice...</Text>
        </View>
      )}

      {matchStatus.status === 'matching' && (
        <View style={styles.statusCard}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.statusText}>Finding your match...</Text>
        </View>
      )}

      {matchStatus.status === 'found' && matchStatus.similarity && (
        <View style={styles.matchFoundCard}>
          <View style={styles.matchHeader}>
            <Ionicons name="heart" size={32} color="#ec4899" />
            <Text style={styles.matchTitle}>Match Found!</Text>
          </View>
          <Text style={styles.matchScore}>
            {Math.round(matchStatus.similarity * 100)}% Compatibility
          </Text>
          <Text style={styles.matchDescription}>
            Great emotional match! Start a conversation now.
          </Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={handleStartCall}
          >
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.callButtonText}>Start Call</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tips Section */}
      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>Tips for Better Matches</Text>
        <View style={styles.tipItem}>
          <Ionicons name="mic" size={20} color="#3b82f6" />
          <Text style={styles.tipText}>Speak clearly and express your emotions</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="time" size={20} color="#3b82f6" />
          <Text style={styles.tipText}>Record 5-30 seconds for best results</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="heart" size={20} color="#3b82f6" />
          <Text style={styles.tipText}>Be authentic - your voice tells your story</Text>
        </View>
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
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
  recorderSection: {
    padding: 24,
    alignItems: 'center',
  },
  statusCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 24,
    margin: 24,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
  },
  matchFoundCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 24,
    margin: 24,
    borderWidth: 2,
    borderColor: '#ec4899',
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  matchScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ec4899',
    marginBottom: 8,
  },
  matchDescription: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  callButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tipsSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    margin: 24,
    marginTop: 0,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 12,
    flex: 1,
  },
});


