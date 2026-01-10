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

const Signup = () => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? Colors.dark : Colors.light;

  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing fields', 'Please fill all fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`localhost:3000/signupHandler.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Save token / user info (AsyncStorage or SecureStore)
        router.replace('/profile');
      } else {
        Alert.alert('Signup failed', data.message || 'Try again');
      }
    } catch (err) {
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
            <Text style={[styles.title, { color: theme.title }]}>Create account</Text>
            <Text style={[styles.subtitle, { color: theme.muted }]}>Start your spiritual journey</Text>

            {/* NAME */}
            <View style={styles.inputGroup}>
              <Ionicons name="person-outline" size={20} color={theme.muted} />
              <TextInput
                placeholder="Name"
                placeholderTextColor={theme.muted}
                style={[styles.input, { color: theme.text }]}
                value={name}
                onChangeText={setName}
              />
            </View>

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
              onPress={onSignup}
              style={[styles.button, { backgroundColor: Colors.primary }]}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Creating account...' : 'Create account'}
              </Text>
            </Pressable>

            <Link href="/auth/login" asChild>
              <Pressable>
                <Text style={[styles.link, { color: theme.iconFocused }]}>
                  Already have an account? Login
                </Text>
              </Pressable>
            </Link>
          </ThemedCard>
        </ThemedView>
    </>
  );
};

export default Signup;

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
