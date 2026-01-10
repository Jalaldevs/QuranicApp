import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useColorScheme,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import ThemedView from '../components/ThemedView';
import ThemedCard from '../components/ThemedCard';
import Colors from '../constants/Colors';
import { Link, router } from 'expo-router';
import SecondaryHeader from '../components/SecondaryHeader';
/**
 * EXPECTED USER SHAPE (from PHP backend later)
 * {
 *   id: 1,
 *   name: 'Jalal',
 *   email: 'user@email.com'
 * }
 */

const Profile = ({ navigation }) => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? Colors.dark : Colors.light;

  // 🔧 later replace with AuthContext / secure storage
  const user = null; // null = guest, object = logged in

  const logout = () => {
    Alert.alert('Logout', 'Session cleared (hook backend logic)');
  };

  return (
    <>
      <SecondaryHeader/>
      <ThemedView style={styles.container}>
        {/* ---------- USER CARD ---------- */}
        <ThemedCard intensity={28} style={styles.profileCard}>
          {user ? (
            <>
              <Ionicons
                name="person-circle-outline"
                size={82}
                color={theme.iconFocused}
              />

              <Text style={[styles.name, { color: theme.title }]}>
                {user.name}
              </Text>

              <Text style={[styles.email, { color: theme.muted }]}>
                {user.email}
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name="person-outline"
                size={68}
                color={theme.muted}
              />
              <Text style={[styles.guestTitle, { color: theme.title }]}>
                Guest mode
              </Text>

              <Text style={[styles.guestText, { color: theme.muted }]}>
                Sign in to continue. Access your profile and more.
              </Text>
            </>
          )}
        </ThemedCard>

        {/* ---------- ACTIONS ---------- */}
        <ThemedCard intensity={22} style={styles.actionsCard}>
          {user ? (
            <>
              <Action
                icon="log-out-outline"
                label="Logout"
                danger
                onPress={logout}
                theme={theme}
              />
            </>
          ) : (
            <>
              <Link href="/auth/login" asChild>
                <PrimaryButton
                  label="Login"
                />
              </Link>
              <Link href="/auth/signup" asChild>
                <SecondaryButton
                  label="Create account"
                  theme={theme}
                />
              </Link>
            </>
          )}
        </ThemedCard>
      </ThemedView>
    </>
  );
};

export default Profile;

/* ---------- COMPONENTS ---------- */

const Action = ({ icon, label, onPress, danger, theme }) => (
  <Pressable onPress={onPress} style={styles.actionRow}>
    <View style={styles.actionLeft}>
      <Ionicons
        name={icon}
        size={22}
        color={danger ? '#EF4444' : theme.icon}
      />
      <Text
        style={[
          styles.actionText,
          { color: danger ? '#EF4444' : theme.text },
        ]}
      >
        {label}
      </Text>
    </View>
    <Ionicons
      name="chevron-forward"
      size={20}
      color={theme.muted}
    />
  </Pressable>
);

const PrimaryButton = ({ label, onPress }) => (
  <Pressable onPress={onPress} style={styles.primaryButton}>
    <Text style={styles.primaryButtonText}>{label}</Text>
  </Pressable>
);

const SecondaryButton = ({ label, onPress, theme }) => (
  <Pressable
    onPress={onPress}
    style={[styles.secondaryButton, { borderColor: theme.border }]}
  >
    <Text
      style={[
        styles.secondaryButtonText,
        { color: theme.iconFocused },
      ]}
    >
      {label}
    </Text>
  </Pressable>
);

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 26,
    justifyContent: 'center',
    marginBottom: 38,
  },

  profileCard: {
    borderRadius: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 6,
    elevation: 20,
  },

  name: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 6,
  },

  email: {
    fontSize: 14,
  },

  guestTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
  },

  guestText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },

  actionsCard: {
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 22,
    elevation: 16,
    gap: 6,
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },

  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },

  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 6,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  secondaryButton: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 6,
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
