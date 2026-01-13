import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  useColorScheme,
  Pressable,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import Header from '../components/Header';
import ThemedView from '../components/ThemedView';
import ThemedCard from '../components/ThemedCard';
import Colors from '../constants/Colors';

const Home = () => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? Colors.dark : Colors.light;

  const [prayerTimes, setPrayerTimes] = useState({
    Fajr: '--',
    Sunrise: '--',
    Dhuhr: '--',
    Asr: '--',
    Maghrib: '--',
    Isha: '--',
    MidNight: '--',
    HijriDay: '--',
    HijriMonth: '--',
    HijriYear: '--',
  });

  const [userCity, setUserCity] = useState('Fetching...');
  const [locationGranted, setLocationGranted] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [nextPrayer, setNextPrayer] = useState({ name: '', time: '' });
  const [countdown, setCountdown] = useState('00:00:00');

  const [notifications, setNotifications] = useState({
    Fajr: false,
    Sunrise: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false,
  });

  // ---------------- LOCATION ----------------

  const getUserLocation = async () => {
    setLoadingLocation(true);

    const { status, canAskAgain } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setLoadingLocation(false);

      Alert.alert(
        'Permission Required',
        'Location is needed to show prayer times.',
        canAskAgain
          ? [{ text: 'Try Again', onPress: getUserLocation }]
          : [{ text: 'Open Settings', onPress: () => Linking.openSettings() }]
      );
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    setLoadingLocation(false);
    setLocationGranted(true);
    return location.coords;
  };

  const getCityFromCoords = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();

      return (
        data.address.city ||
        data.address.town ||
        data.address.village ||
        'Unknown'
      );
    } catch {
      return 'Unknown';
    }
  };

  const fetchPrayerTimes = async ({ latitude, longitude }) => {
    try {
      const res = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=3&school=0`
      );
      const data = await res.json();

      setPrayerTimes({
        Fajr: data.data.timings.Fajr,
        Sunrise: data.data.timings.Sunrise,
        Dhuhr: data.data.timings.Dhuhr,
        Asr: data.data.timings.Asr,
        Maghrib: data.data.timings.Maghrib,
        Isha: data.data.timings.Isha,
        MidNight: data.data.timings.Midnight,
        HijriDay: data.data.date.hijri.day,
        HijriMonth: data.data.date.hijri.month.en,
        HijriYear: data.data.date.hijri.year,
      });

      const city = await getCityFromCoords(latitude, longitude);
      setUserCity(city);
    } catch {
      Alert.alert('Error', 'Failed to fetch prayer times.');
    }
  };

  // ---------------- NEXT PRAYER ----------------

  const PRAYER_ICONS = {
    Fajr: 'cloudy-night',
    Sunrise: 'partly-sunny',
    Dhuhr: 'sunny',
    Asr: 'partly-sunny',
    Maghrib: 'cloudy-night',
    Isha: 'moon',
  };

  const getNextPrayerTime = () => {
    const prayers = [
      { name: 'Fajr', time: prayerTimes.Fajr },
      { name: 'Sunrise', time: prayerTimes.Sunrise },
      { name: 'Dhuhr', time: prayerTimes.Dhuhr },
      { name: 'Asr', time: prayerTimes.Asr },
      { name: 'Maghrib', time: prayerTimes.Maghrib },
      { name: 'Isha', time: prayerTimes.Isha },
    ];

    const now = new Date();

    for (const prayer of prayers) {
      if (!prayer.time || prayer.time === '--') continue;

      const [h, m] = prayer.time.split(':').map(Number);
      const date = new Date();
      date.setHours(h, m, 0, 0);

      if (date > now) {
        updateCountdown(prayer, date);
        return;
      }
    }

    // fallback → next day's Fajr
    if (prayerTimes.Fajr !== '--') {
      const [h, m] = prayerTimes.Fajr.split(':').map(Number);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(h, m, 0, 0);

      updateCountdown({ name: 'Fajr', time: prayerTimes.Fajr }, tomorrow);
    }
  };

  const updateCountdown = (prayer, date) => {
    const diff = date - new Date();
    if (diff <= 0) return;

    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');

    setNextPrayer(prayer);
    setCountdown(`${h}:${m}:${s}`);
  };

  // ---------------- EFFECTS ----------------

  useEffect(() => {
    (async () => {
      const coords = await getUserLocation();
      if (coords) fetchPrayerTimes(coords);
    })();
  }, []);

  useEffect(() => {
    if (prayerTimes.Fajr !== '--') {
      getNextPrayerTime();
      const timer = setInterval(getNextPrayerTime, 1000);
      return () => clearInterval(timer);
    }
  }, [prayerTimes]);

  // ---------------- UI ----------------

  return (
    <>
      <Header />
      <ThemedView style={styles.container}>
        <ThemedCard intensity={28} style={styles.heroCard}>
          <Pressable
            onPress={async () => {
              const coords = await getUserLocation();
              if (coords) fetchPrayerTimes(coords);
            }}
          >
            <Text style={[styles.heroLabel, { color: theme.dontKnow }]}>
              {loadingLocation
                ? 'Getting location...'
                : locationGranted
                ? userCity
                : 'Tap to allow location'}{' '}
              <Ionicons
                name="location-outline"
                size={16}
                color={theme.dontKnow}
              />
            </Text>
          </Pressable>

          <View style={styles.heroTopRow}>
            <View style={styles.heroLeft}>
              <Ionicons
                name={PRAYER_ICONS[nextPrayer.name]}
                size={26}
                color={theme.dontKnow}
              />
              <Text style={[styles.heroPrayer, { color: theme.title }]}>
                {nextPrayer.name}
              </Text>
            </View>

            <Text style={[styles.heroCountdown, { color: theme.title }]}>
              {countdown}
            </Text>
          </View>

          <Text style={[styles.heroMeta, { color: theme.muted }]}>
            {prayerTimes.HijriDay} {prayerTimes.HijriMonth}{' '}
            {prayerTimes.HijriYear}
          </Text>
        </ThemedCard>

        <ThemedCard intensity={22} style={styles.timesCard}>
          {[
            ['Fajr', prayerTimes.Fajr, 'cloudy-night-outline'],
            ['Sunrise', prayerTimes.Sunrise, 'partly-sunny-outline'],
            ['Dhuhr', prayerTimes.Dhuhr, 'sunny-outline'],
            ['Asr', prayerTimes.Asr, 'partly-sunny-outline'],
            ['Maghrib', prayerTimes.Maghrib, 'cloudy-night-outline'],
            ['Isha', prayerTimes.Isha, 'moon-outline'],
          ].map(([name, time, icon]) => (
            <PrayerRow
              key={name}
              name={name}
              time={time}
              icon={icon}
              theme={theme}
              enabled={notifications[name]}
              onToggle={() =>
                setNotifications(prev => ({
                  ...prev,
                  [name]: !prev[name],
                }))
              }
            />
          ))}
        </ThemedCard>
      </ThemedView>
    </>
  );
};

const PrayerRow = ({ name, time, icon, theme, enabled, onToggle }) => (
  <View style={styles.prayerRow}>
    <View style={styles.prayerLeft}>
      <Ionicons name={icon} size={26} color={theme.icon} />
      <Text style={[styles.prayerName, { color: theme.text }]}>
        {name}
      </Text>
    </View>

    <View style={styles.prayerRight}>
      <Text style={[styles.prayerTime, { color: theme.title }]}>
        {time}
      </Text>

      <Pressable onPress={onToggle} hitSlop={10}>
        <Ionicons
          name={enabled ? 'notifications' : 'notifications-off-outline'}
          size={22}
          color={enabled ? theme.dontKnow : theme.muted}
        />
      </Pressable>
    </View>
  </View>
);

export default Home;

// ---------------- STYLES ----------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  heroCard: {
    borderRadius: 30,
    paddingVertical: 36,
    paddingHorizontal: 38,
    elevation: 20,
    marginTop: 6,
    marginBottom: 5,
  },
  heroLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  heroTopRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroPrayer: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  heroCountdown: {
    fontSize: 36,
    fontWeight: '700',
  },
  heroMeta: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: 'bold',
  },
  timesCard: {
    borderRadius: 30,
    elevation: 16,
    paddingVertical: 23,
    paddingHorizontal: 33,
    marginTop: 25,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  prayerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prayerName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  prayerTime: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  prayerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 17,
  },
});
