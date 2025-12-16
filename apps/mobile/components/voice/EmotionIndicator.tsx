import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmotionIndicatorProps {
  emotion?: string;
  confidence?: number;
}

const emotionIcons: Record<string, string> = {
  happy: 'happy',
  excited: 'flash',
  calm: 'leaf',
  romantic: 'heart',
  playful: 'game-controller',
  lonely: 'cloudy',
  sad: 'sad',
  anxious: 'warning',
};

const emotionColors: Record<string, string> = {
  happy: '#fbbf24',
  excited: '#f97316',
  calm: '#10b981',
  romantic: '#ec4899',
  playful: '#8b5cf6',
  lonely: '#6b7280',
  sad: '#3b82f6',
  anxious: '#ef4444',
};

export function EmotionIndicator({ emotion, confidence = 0 }: EmotionIndicatorProps) {
  if (!emotion) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Analyzing emotion...</Text>
      </View>
    );
  }

  const icon = emotionIcons[emotion] || 'pulse';
  const color = emotionColors[emotion] || '#3b82f6';
  const percentage = Math.round(confidence * 100);

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.emotion, { color }]}>
          {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
        </Text>
        <Text style={styles.confidence}>{percentage}% match</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginTop: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  emotion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  confidence: {
    fontSize: 12,
    color: '#999',
  },
  label: {
    fontSize: 14,
    color: '#999',
  },
});

