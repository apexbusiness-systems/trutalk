import { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const { token_hash, type } = params;

      if (token_hash && type === 'email') {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token_hash as string,
            type: 'email',
          });

          if (error) throw error;

          setTimeout(() => router.replace('/(tabs)'), 1000);
        } catch (error) {
          console.error('Email verification error:', error);
          setTimeout(() => router.replace('/(auth)/login'), 1000);
        }
      } else {
        setTimeout(() => router.replace('/(auth)/login'), 500);
      }
    };

    handleCallback();
  }, [params]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text style={styles.text}>Verifying your email...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' },
  text: { color: '#fff', fontSize: 16, marginTop: 16 }
});
