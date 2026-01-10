import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  useColorScheme,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

import ThemedView from '../components/ThemedView';
import ThemedCard from '../components/ThemedCard';
import Colors from '../constants/Colors';
import SecondaryHeader from '../components/SecondaryHeader';

const Login = () => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? Colors.dark : Colors.light;

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      Alert.alert('Missing fields', 'Please enter email and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    if (cleanPassword.length < 6) {
      Alert.alert('Password too short', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/app/backend/validation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.replace('/profile');
      } else {
        Alert.alert('Login failed', data.message || 'Check credentials');
      }
    } catch {
      Alert.alert('Error', 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SecondaryHeader/>
      <ThemedView style={styles.container}>
        <ThemedCard intensity={28} style={styles.card}>
          <Text style={[styles.title, { color: theme.title }]}>
            Welcome back
          </Text>

          <Text style={[styles.subtitle, { color: theme.muted }]}>
            Sign in to continue
          </Text>

          {/* EMAIL */}
          <View style={styles.inputGroup}>
            <Ionicons name="mail-outline" size={20} color={theme.muted} />
            <TextInput
              placeholder="Email"
              placeholderTextColor={theme.muted}
              style={[styles.input, { color: theme.text }]}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          {/* PASSWORD */}
          <View style={styles.inputGroup}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.muted} />
            <TextInput
              placeholder="Password"
              placeholderTextColor={theme.muted}
              style={[styles.input, { color: theme.text }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Pressable
            onPress={onLogin}
            style={[styles.button, { backgroundColor: Colors.primary }]}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Signing in...' : 'Login'}
            </Text>
          </Pressable>

          <Link href="/auth/signup" asChild>
            <Pressable>
              <Text style={[styles.link, { color: theme.iconFocused }]}>
                Don’t have an account? Sign up
              </Text>
            </Pressable>
          </Link>
        </ThemedCard>
      </ThemedView>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, justifyContent: 'center', marginBottom: 24 },
  card: { borderRadius: 32, padding: 34, gap: 22, elevation: 20 },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { fontSize: 15, marginBottom: 10 },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  input: { flex: 1, fontSize: 16 },
  button: { marginTop: 14, borderRadius: 18, paddingVertical: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { textAlign: 'center', fontWeight: '600', marginTop: 6 },
});
