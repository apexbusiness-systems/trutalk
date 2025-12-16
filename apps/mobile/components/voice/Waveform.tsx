import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface WaveformProps {
  isRecording: boolean;
  amplitude?: number; // 0-1
}

export function Waveform({ isRecording, amplitude = 0.5 }: WaveformProps) {
  const bars = Array.from({ length: 20 }, (_, i) => i);
  const animations = useRef(
    bars.map(() => new Animated.Value(0.3))
  ).current;

  useEffect(() => {
    if (!isRecording) {
      // Reset all bars
      animations.forEach(anim => anim.setValue(0.3));
      return;
    }

    // Animate bars with different delays for wave effect
    const anims = animations.map((anim, index) => {
      const delay = index * 50;
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: amplitude,
            duration: 300 + Math.random() * 200,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 300 + Math.random() * 200,
            useNativeDriver: true,
          }),
        ])
      );
    });

    anims.forEach(anim => anim.start());

    return () => {
      anims.forEach(anim => anim.stop());
    };
  }, [isRecording, amplitude, animations]);

  return (
    <View style={styles.container}>
      {bars.map((_, index) => {
        const animatedHeight = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [8, 40],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                height: animatedHeight,
                opacity: animations[index],
              },
            ]}
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
    justifyContent: 'center',
    height: 50,
    gap: 3,
  },
  bar: {
    width: 3,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
    minHeight: 8,
  },
});

