import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Waveform } from './Waveform';
import { EmotionIndicator } from './EmotionIndicator';

export function VoiceRecorder() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [emotionConfidence, setEmotionConfidence] = useState(0);

  // Track recording duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  async function startRecording() {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission denied');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      setDetectedEmotion(null);
      setEmotionConfidence(0);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;

    setIsRecording(false);
    setIsProcessing(true);
    
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      
      recording.getURI(); // TODO: Use this URI for upload
      setRecording(null);
      
      // TODO: Upload to Supabase Storage and process
      // Simulate emotion detection
      setTimeout(() => {
        const emotions = ['happy', 'excited', 'calm', 'romantic', 'playful'];
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        setDetectedEmotion(randomEmotion);
        setEmotionConfidence(0.75 + Math.random() * 0.2);
        setIsProcessing(false);
      }, 1500);
      
    } catch (err) {
      console.error('Failed to stop recording', err);
      setIsProcessing(false);
    }
  }

  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.recorderContainer}>
        {/* Waveform visualization */}
        {isRecording && (
          <View style={styles.waveformContainer}>
            <Waveform isRecording={isRecording} amplitude={0.7} />
          </View>
        )}

        {/* Recording button */}
        <TouchableOpacity
          style={[
            styles.recordButton,
            isRecording && styles.recordButtonActive,
            isProcessing && styles.recordButtonProcessing,
          ]}
          onPressIn={startRecording}
          onPressOut={stopRecording}
          disabled={isProcessing}
          activeOpacity={0.8}
        >
          {isProcessing ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Ionicons
              name={isRecording ? 'stop' : 'mic'}
              size={48}
              color="#fff"
            />
          )}
        </TouchableOpacity>

        {/* Duration display */}
        {isRecording && (
          <Text style={styles.duration}>
            {formatDuration(recordingDuration)}
          </Text>
        )}

        {/* Instruction text */}
        <Text style={styles.instruction}>
          {isProcessing
            ? 'Processing...'
            : isRecording
            ? 'Release to stop'
            : 'Hold to record'}
        </Text>

        {/* Emotion indicator */}
        {detectedEmotion && !isRecording && (
          <EmotionIndicator
            emotion={detectedEmotion}
            confidence={emotionConfidence}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  recorderContainer: {
    alignItems: 'center',
    width: '100%',
  },
  waveformContainer: {
    marginBottom: 24,
    width: '100%',
    paddingHorizontal: 20,
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordButtonActive: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
    transform: [{ scale: 1.1 }],
  },
  recordButtonProcessing: {
    backgroundColor: '#6b7280',
    shadowColor: '#6b7280',
  },
  duration: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    fontVariant: ['tabular-nums'],
  },
  instruction: {
    color: '#999',
    fontSize: 16,
    marginTop: 8,
  },
});


