import { Stack } from 'expo-router';
import { Toast } from '@/components/Toast';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0a0a0a' },
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="call/[id]" />
      </Stack>
      <Toast />
    </>
  );
}


