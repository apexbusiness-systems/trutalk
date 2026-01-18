import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VoiceRecorder } from '@/components/voice/VoiceRecorder';
import { VoiceWaveform } from '@/components/voice/VoiceWaveform';

export default function MatchScreen() {
  const [isRecording] = useState(false);
  const [onlineCount] = useState(127); // Will be real-time from Supabase

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>TRU Talk</Text>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>{onlineCount} online now</Text>
          </View>
        </View>
      </View>

      {/* Quick Match Section */}
      <View style={styles.quickMatchSection}>
        <Text style={styles.sectionTitle}>Quick Match</Text>
        <Text style={styles.sectionSubtitle}>Tap to find someone to talk to right now</Text>

        <TouchableOpacity
          style={styles.quickMatchButton}
          activeOpacity={0.8}
        >
          <View style={styles.pulseOuter}>
            <View style={styles.pulseInner}>
              <Ionicons name="mic" size={32} color="#fff" />
            </View>
          </View>
          <Text style={styles.quickMatchText}>Start Matching</Text>
        </TouchableOpacity>

        <VoiceWaveform isRecording={isRecording} />
      </View>

      {/* Voice Recorder */}
      <View style={styles.recorderSection}>
        <Text style={styles.sectionTitle}>Record Your Voice</Text>
        <Text style={styles.sectionSubtitle}>Share how you&apos;re feeling for better matches</Text>
        <VoiceRecorder />
      </View>

      {/* Tips */}
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
          <Text style={styles.tipText}>
            {'Be authentic - your voice tells your story'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { paddingBottom: 32 },
  header: { padding: 24, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e', marginRight: 6 },
  onlineText: { fontSize: 14, color: '#999' },
  quickMatchSection: { backgroundColor: '#1a1a1a', borderRadius: 16, padding: 24, marginHorizontal: 24, marginTop: 16, alignItems: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#fff', textAlign: 'center' },
  sectionSubtitle: { fontSize: 14, color: '#999', marginTop: 4, textAlign: 'center', marginBottom: 24 },
  quickMatchButton: { alignItems: 'center', marginBottom: 24 },
  pulseOuter: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(59, 130, 246, 0.1)', justifyContent: 'center', alignItems: 'center' },
  pulseInner: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center' },
  quickMatchText: { fontSize: 18, fontWeight: '600', color: '#fff', marginTop: 16 },
  recorderSection: { padding: 24 },
  tipsSection: { backgroundColor: '#1a1a1a', borderRadius: 16, padding: 20, marginHorizontal: 24, marginTop: 16 },
  tipsTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 16 },
  tipItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  tipText: { fontSize: 14, color: '#e5e5e5', marginLeft: 12, flex: 1 },
});
