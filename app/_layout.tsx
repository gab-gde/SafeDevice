import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '../constants';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!session && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, segments, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }}>
      <Stack.Screen name="auth" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="device/[id]"
        options={{
          headerShown: true,
          title: 'Détail appareil',
          headerTintColor: COLORS.primary,
          headerStyle: { backgroundColor: COLORS.surface },
        }}
      />
      <Stack.Screen
        name="device/form"
        options={{
          headerShown: true,
          title: 'Appareil',
          headerTintColor: COLORS.primary,
          headerStyle: { backgroundColor: COLORS.surface },
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="device/claim-form"
        options={{
          headerShown: true,
          title: 'Déclarer un sinistre',
          headerTintColor: COLORS.danger,
          headerStyle: { backgroundColor: COLORS.surface },
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
