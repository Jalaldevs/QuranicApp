import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { useRouter } from 'expo-router';
import SecondaryHeader from '../components/SecondaryHeader';
import ThemedView from '../components/ThemedView';
import ThemedCard from '../components/ThemedCard';
import SectionHeader from '../components/SectionHeader';
import SettingsItem from '../components/SettingsItems';

const Settings = () => {
  const router = useRouter();

  return (
    <>
    <SecondaryHeader/>
      <ThemedView style={styles.container}>
        {/* ─── FEATURES ───────────────────────────── */}
        <SectionHeader title="Features" />
        <ThemedCard style={styles.card}>
          <SettingsItem
            icon="star"
            label="Names of Allah"
            onPress={() => router.push('/secondary/namesOfAllah')}
          />
          <SettingsItem
            icon="infinite"
            label="Tasbeeh"
            onPress={() => router.push('/secondary/tasbeeh')}
          />
        </ThemedCard>
        {/* ─── USER SETTINGS ───────────────────────── */}
        <SectionHeader title="Preferences" />
        <ThemedCard style={styles.card}>
          <SettingsItem
            icon="color-palette"
            label="Color Scheme"
            onPress={() => router.push('/theme-settings')}
          />
          <SettingsItem
            icon="notifications"
            label="Notifications"
            onPress={() => router.push('/notification-settings')}
          />
        </ThemedCard>
        {/* ─── ABOUT & LEGAL ───────────────────────── */}
        <SectionHeader title="About" />
        <ThemedCard style={styles.card}>
          <SettingsItem
            icon="person"
            label="App Developer"
            onPress={() => router.push('/acknowledgments')}
          />
          <SettingsItem
            icon="heart"
            label="Support the App"
            onPress={() => router.push('/support')}
          />
          <SettingsItem
            icon="shield-checkmark"
            label="Privacy Policy"
            onPress={() => router.push('/privacy')}
          />
          <SettingsItem
            icon="document-text"
            label="Terms of Use"
            onPress={() => router.push('/secondary/terms-of-use.html')}
          />
          <SettingsItem
            icon="information-circle"
            label="Consent Settings"
            onPress={() => router.push('/acknowledgments')}
          />
        </ThemedCard>
    </ThemedView>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 26,
    paddingHorizontal: 18
  },
  card: {
    borderRadius: 18,
    paddingHorizontal: 16,
  },
});
