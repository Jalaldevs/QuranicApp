import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  View,
  ActivityIndicator,
  Modal
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

import translationsKeys from '../constants/transaltionsKeys';
import Header from '../components/Header';
import ThemedView from '../components/ThemedView';
import ThemedCard from '../components/ThemedCard';
import Colors from '../constants/Colors';
import surahs from '../constants/surahs';
import { useNavigation } from 'expo-router';

const Quran = () => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? Colors.dark : Colors.light;

  const [selectedSurah, setSelectedSurah] = useState(surahs[0]);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [languagesMenu, setLanguagesMenu] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState('english');

  const [fontsLoaded] = useFonts({
    UthmanicHafs: require('../../assets/fonts/KFGQPC-Uthmanic-Script-HAFS-Regular.otf'),
  });

    const fetchSurah = async (surahId, language) => {

    try {
      setLoading(true);

      const [arabicRes, translationRes] = await Promise.all([
        fetch(`https://raw.githubusercontent.com/Jalaldevs/QuranAPI/main/Arabic/${surahId}.json`),
        fetch(`https://raw.githubusercontent.com/Jalaldevs/QuranAPI/main/languages/${language}.json`)
      ]);

      const arabicJson = await arabicRes.json();
      const translationJson = await translationRes.json();

      const BASMALA = {
        id: 0,
        arabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        translation: translationJson.quran[0].text,
        isBasmala: true,
      };

      const translationAyahs = translationJson.quran.filter(
        v => v.chapter === surahId
      );

      const translationMap = Object.fromEntries(
        translationAyahs.map(v => [v.verse, v.text])
      );

      const ayahsData = arabicJson.verses.map(v => ({
        id: v.id,
        arabic: v.text,
        translation: translationMap[v.id] || '',
      }));

      const shouldAddBasmala = surahId !== 1 && surahId !== 9;

      setAyahs(
        shouldAddBasmala ? [BASMALA, ...ayahsData] : ayahsData
      );
    } catch (err) {
      console.error(err);
      alert('Failed to load surah');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fontsLoaded) {
      fetchSurah(selectedSurah.id, selectedTranslation);
    }
  }, [fontsLoaded, selectedSurah, selectedTranslation]);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: languagesMenu
        ? { display: 'none' }
        : { backgroundColor: theme.background, height: 55 },
    });
  }, [languagesMenu, theme]);

  if (!fontsLoaded) return null;

  return (
    <>
      <Header from='Quran'/>
      <ThemedView style={styles.container}>
        {/* SURAH SELECTOR */}
        <View>
          <FlatList
            horizontal
            data={surahs}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectorScroll}
            renderItem={({ item }) => {
              const active = item.id === selectedSurah.id;
              return (
                <TouchableOpacity
                  onPress={() => setSelectedSurah(item)}
                  style={[
                    styles.surahButton,
                    { 
                      borderColor: scheme === 'dark' ? '#4b5563' : '#CCC',
                      backgroundColor: scheme === 'dark' && !active ? '#1e293b' : 'transparent'
                    },
                    active && {
                      borderColor: '#1976d2',
                      backgroundColor: scheme === 'dark' ? '#1e3a8a' : '#e3f2fd',
                    },
                  ]}
                >
                  <Text style={[
                    styles.surahButtonText, 
                    { 
                      color: active 
                        ? (scheme === 'dark' ? '#fff' : theme.text)
                        : (scheme === 'light' ? '#e2e8f0' : theme.text)
                    }
                  ]}>
                    {item.id}. {item.latin}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <Text style={[styles.surahTitle, { color: theme.primary }]}>
          Surah {selectedSurah.latin}
        </Text>

        {/* AYAH LIST */}
        <ThemedCard intensity={18} style={styles.card}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.primary} />
          ) : (
            <FlatList
              data={ayahs}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingBottom: 30, gap: 18 }}
              renderItem={({ item }) => (
                <View style={styles.ayahContainer}>
                  <View style={styles.ayahHeader}>
                    <Text style={[styles.ayahNumber, { color: theme.muted }]}>
                      {item.id}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setLanguagesMenu(!languagesMenu)}
                      style={styles.iconButton}
                    >
                    <MaterialIcons 
                      name="public" 
                      size={24} 
                      color={scheme === 'dark' ? '#60a5fa' : theme.primary} 
                    />
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={[
                      styles.arabicText,
                      { color: theme.text, fontFamily: 'UthmanicHafs' },
                    ]}
                  >
                    {item.arabic}
                  </Text>

                  <Text style={[styles.translationText, { color: theme.muted }]}>
                    {item.translation}
                  </Text>
                </View>
              )}
            />
          )}
        </ThemedCard>
      </ThemedView>
      {/* LANGUAGES MENU */}
      {languagesMenu && (
        <>
        <Modal
          visible={languagesMenu}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSearchMenu(false)}
        >
          <ThemedView style={styles.languagesOverlay}>
              <ThemedCard intensity={28} style={styles.languagesSheet}>
                <View style={[styles.languagesHeader, { borderBottomColor: theme.muted }]}>
                  <Text style={[styles.languagesTitle, { color: theme.text }]}>Translations</Text>
                  <TouchableOpacity onPress={() => setLanguagesMenu(false)}>
                    <Ionicons name="close-outline" size={34} color={theme.text} />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={translationsKeys}
                  numColumns={2}
                  persistentScrollbar={true} 
                  keyExtractor={item => item}
                  contentContainerStyle={styles.languagesList}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.languagesItem,
                        { backgroundColor: scheme === 'dark' ? '#374151' : '#f3f4f6' },
                        item === selectedTranslation && {
                          backgroundColor: scheme === 'dark' ? '#1e3a8a' : '#dbeafe',
                        },
                      ]}
                      onPress={() => {
                        setSelectedTranslation(item);
                        setLanguagesMenu(false);
                      }}
                    >
                      <Text style={[styles.languagesText, { color: theme.text }]}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </ThemedCard>
            </ThemedView>
          </Modal>
        </>
      )}
    </>
  );
};

export default Quran;

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: 10, paddingHorizontal: 16, gap: 16 },
  selectorScroll: { flexDirection: 'row', gap: 10 },

  surahButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  surahButtonText: { fontSize: 14, fontWeight: '600' },

  surahTitleContainer: {
    justifyContent: 'center',
    marginTop: 20,
  },
  surahTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },

  card: {
    borderRadius: 22,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    flex: 1,
  },

  ayahContainer: {
    gap: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCC',
    paddingBottom: 12,
  },
  ayahHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ayahNumber: { fontSize: 14, fontWeight: '600' },
  ayahActions: { flexDirection: 'row', gap: 12 },
  iconButton: { padding: 4 },
  arabicText: { fontSize: 31, textAlign: 'right', marginTop: 6, paddingLeft: 30, paddingRight: 3, writingDirection: 'rtl', },
  translationText: { fontSize: 16.5, lineHeight: 22, marginTop: 4 },
  languagesOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },

  languagesSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '80%',
  },

  languagesHeader: {
    alignItems: 'center',
    paddingHorizontal: 26,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#DDD',
  },

  languagesTitle: {
    fontSize: 22,
    fontWeight: '700',
  },

  languagesList: {
    padding: 10,

  },

  languagesItem: {
    flex: 1,
    margin: 8,
    paddingVertical: 15.3,
    borderRadius: 16,
    alignItems: 'center',
  },

  languagesText: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
