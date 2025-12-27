import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

interface VoiceWaveformProps {
  isRecording?: boolean;
  color?: string;
}

export function VoiceWaveform({ isRecording = false, color = '#3b82f6' }: VoiceWaveformProps) {
  const bars = Array.from({ length: 30 }, () => useSharedValue(0.3));

  useEffect(() => {
    if (isRecording) {
      bars.forEach((bar, index) => {
        bar.value = withRepeat(
          withTiming(Math.random() * 0.7 + 0.3, {
            duration: 300 + Math.random() * 200
          }),
          -1,
          true
        );
      });
    } else {
      bars.forEach(bar => {
        bar.value = withTiming(0.3, { duration: 200 });
      });
    }
  }, [isRecording]);

  return (
    <View style={styles.container}>
      {bars.map((bar, index) => {
        const animatedStyle = useAnimatedStyle(() => ({
          height: `${bar.value * 100}%`,
          backgroundColor: color,
        }));

        return (
          <Animated.View
            key={index}
            style={[styles.bar, animatedStyle]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    gap: 3,
    justifyContent: 'center',
  },
  bar: {
    width: 3,
    borderRadius: 2,
    minHeight: 4,
  },
});
