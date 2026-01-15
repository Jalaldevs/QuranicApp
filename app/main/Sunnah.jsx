import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
  useColorScheme,
  ActivityIndicator,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import ThemedView from '../components/ThemedView';
import ThemedCard from '../components/ThemedCard';
import Colors from '../constants/Colors';
import { useNavigation } from 'expo-router';
import { booksFrontEnd, BOOKS } from '../constants/sunnahBooks';

export const LANGUAGE_CODE_MAP = {
    English: 'eng',
    French: 'fra',
    Urdu: 'urd',
    Turkish: 'tur',
    Indonesian: 'ind',
    Bengali: 'ben',
    Russian: 'rus',
    Tamil: 'tam',
};

const sectionsFrontEnd = []

/** Clean HTML remnants from hadith */
const cleanHadithText = (text) => {
  if (!text) return '';
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .trim();
};

const STORAGE_TRANSLATION_KEY = '@sunnah:selectedTranslation';

export default function Sunnah() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? Colors.dark : Colors.light;

  const [selectedBook, setSelectedBook] = useState('abudawud');
  const [metadata, setMetadata] = useState(null);
  const [hadiths, setHadiths] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [languagesMenu, setLanguagesMenu] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState('English');

  const [fontsLoaded] = useFonts({
    UthmanicHafs: require('../../assets/fonts/KFGQPC-Uthmanic-Script-HAFS-Regular.otf'),
  });

  const [avaliableTranlations, setAvaliableTranslations] = useState([]);

  useEffect(() => {
  const loadSavedTranslation = async () => {
    const saved = await AsyncStorage.getItem(STORAGE_TRANSLATION_KEY);
    if (saved) {
      setSelectedTranslation(saved);
    }
  };
  loadSavedTranslation();
}, []);

  const fetchAvaliableLanguages = async (selectedBook) => {
  try {
    const res = await fetch(
      'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions.json'
    );
    const data = await res.json();

    const book = data[selectedBook];
    if (!book) return;

    const langs = book.collection
      .filter(item => item.language !== 'Arabic')
      .map(item => item.language);

    const uniqueLangs = [...new Set(langs)].filter(
      lang => LANGUAGE_CODE_MAP[lang]
    );

    setAvaliableTranslations(uniqueLangs);

    // safety fallback
    setSelectedTranslation(prev =>
      uniqueLangs.includes(prev) ? prev : uniqueLangs[0]
    );
  } catch (e) {
    console.error('Failed to load languages', e);
  }
};

    useEffect(() => {
      fetchAvaliableLanguages(selectedBook);
    }, [selectedBook]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);

        const araRes = await fetch(
            `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-${selectedBook}.min.json`
          );

        const araData = await araRes.json();

        setMetadata(araData.metadata);
        setHadiths(araData.hadiths);

        const preparedSections = Object.entries(araData.metadata.sections)
          .map(([id, title]) => {
            const details = araData.metadata.section_details[id];
            if (!details || details.hadithnumber_last === 0) return null;
            return {
              id,
              title: title || `Section ${id}`,
              first: details.hadithnumber_first,
              last: details.hadithnumber_last,
            };
          })
          .filter(Boolean);

        setSections(preparedSections);
        setSelectedSection(preparedSections[0]?.id ?? null);
      } catch (err) {
        console.error('Failed to load sunnah:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [selectedBook]);

  useEffect(() => {
      const fetchTranslation = async () => {
    try {
      if (!avaliableTranlations.includes(selectedTranslation)) {
        // fallback to English if chosen translation is not available
        setSelectedTranslation('English');
        return;
      }

      const langCode = LANGUAGE_CODE_MAP[selectedTranslation];
      const res = await fetch(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${langCode}-${selectedBook}.min.json`
      );

      if (!res.ok) {
        setTranslations([]);
        return;
      }

      const data = await res.json();
      setTranslations(data.hadiths || []);
    } catch (e) {
      console.error('Failed to load translation', e);
      setTranslations([]);
    }
  };

    if (avaliableTranlations.length === 0) return;
    fetchTranslation();
  }, [selectedBook, selectedTranslation, avaliableTranlations]);


  /** Map translations by hadith number */
  const translationMap = useMemo(() => {
    const map = {};
    translations.forEach((h) => {
      map[h.hadithnumber] = h.text;
    });
    return map;
  }, [translations]);

  /** Filter hadiths by selected section */
  const filteredHadiths = useMemo(() => {
    if (!metadata || !selectedSection) return [];
    const details = metadata.section_details[selectedSection];
    if (!details) return [];
    return hadiths.filter(
      (h) =>
        h.hadithnumber >= details.hadithnumber_first &&
        h.hadithnumber <= details.hadithnumber_last
    );
  }, [hadiths, metadata, selectedSection]);

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
    <ThemedView style={styles.container}>
      <Header from='Sunnah'/>

      {/* Book selector */}
      <ThemedView style={styles.selectorsWrapper}>
        <FlatList
          horizontal
          data={BOOKS}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bookSelector}
          renderItem={({ item, index }) => {
            const active = selectedBook === item;
            return (
              <TouchableOpacity
                onPress={() => setSelectedBook(item)}
                style={[
                  styles.bookButton,
                  { 
                    borderColor: scheme === 'dark' ? '#4b5563' : '#ccc',
                    backgroundColor: scheme === 'dark' && !active ? '#1e293b' : 'transparent'
                  },
                  active && {
                    backgroundColor: scheme === 'dark' ? '#1e3a8a' : '#e3f2fd',
                    borderColor: '#1976d2',
                  },
                ]}
              >
                <Text style={[
                  styles.bookText, 
                  { 
                    color: active 
                      ? (scheme === 'dark' ? '#fff' : theme.text)
                      : (scheme === 'dark' ? '#e2e8f0' : theme.text)
                  }
                ]}>
                  {booksFrontEnd[index]}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* Section selector */}
        <FlatList
          horizontal
          data={sections}
          style={styles.secondRow}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sectionList}
          renderItem={({ item }) => {
            const active = selectedSection === item.id;
            return (
              <TouchableOpacity
                onPress={() => setSelectedSection(item.id)}
                style={[
                  styles.bookButton,
                  styles.bookSecond,
                  { 
                    borderColor: scheme === 'dark' ? '#4b5563' : '#ccc',
                    backgroundColor: scheme === 'dark' && !active ? '#1e293b' : 'transparent'
                  },
                  active && {
                    backgroundColor: scheme === 'dark' ? '#1e3a8a' : '#e3f2fd',
                    borderColor: '#1976d2',
                  },
                ]}
              >
                <Text style={[
                  styles.sectionText, 
                  { 
                    color: active 
                      ? (scheme === 'dark' ? '#fff' : theme.text)
                      : (scheme === 'dark' ? '#e2e8f0' : theme.text)
                  }
                ]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </ThemedView>

      {/* Hadith list */}
      <ThemedCard intensity={18} style={styles.hadithCard}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} />
        ) : (
          <FlatList
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            data={filteredHadiths}
            keyExtractor={(item) => item.hadithnumber.toString()}
            contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View style={styles.hadithContainer}>
                <View style={styles.hadithHeader}>
                  <Text style={[styles.hadithNumber, { color: theme.muted }]}>
                    {item.hadithnumber}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity
                      style={styles.iconButton}
                    >
                        <MaterialIcons
                          name='share'
                          size={24}
                          color={scheme === 'dark' ? '#60a5fa' : theme.primary}
                        />
                    </TouchableOpacity>
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
                </View>

              {/* Arabic */}
              {!!item.text && (
                <Text
                  style={[styles.hadithText, { color: theme.text, fontFamily: 'UthmanicHafs' }]}
                >
                  {cleanHadithText(item.text)}
                </Text>
              )}

              {/* Translation: only if Arabic exists */}
              {item.text?.trim() && translationMap[item.hadithnumber]?.trim() && (
                <Text style={[styles.translationText, { color: theme.muted }]}>
                  {cleanHadithText(translationMap[item.hadithnumber])}
                </Text>
              )}


                {/* Hadith grades */}
                {item.grades && item.grades.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    {item.grades.map((g, i) => (
                      <Text key={i} style={{ color: theme.muted, fontSize: 12, paddingHorizontal: 8, paddingVertical: 1 }}>
                        {g.name}: {g.grade}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )}
          />
        )}
      </ThemedCard>
      {languagesMenu && (
        <>
          <Modal 
            visible={languagesMenu}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setLanguagesMenu(false)}
          >
            <ThemedView style={styles.languagesOverlay}>
              <ThemedCard style={[styles.languagesSheet, {backgroundColor: theme.languagesDontKnow}]}>
                <View style={[styles.languagesHeader, { borderBottomColor: theme.muted }]}>
                  <Text style={[styles.languagesTitle, { color: theme.text }]}>Translations</Text>
                  <TouchableOpacity onPress={() => setLanguagesMenu(false)}>
                    <Ionicons name="close-outline" size={34} color={theme.text} />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={avaliableTranlations}
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
                          backgroundColor: scheme === 'dark' ? '#1e3a8a' : '#c7dcf8',
                        },
                      ]}
                      onPress={async () => {
                        try {
                          if (item !== selectedTranslation) {
                            await AsyncStorage.setItem(STORAGE_TRANSLATION_KEY, item);
                            setSelectedTranslation(item);
                          }
                          setLanguagesMenu(false);
                        } catch (e) {
                          console.error('Failed to save translation', e);
                        }
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1},

  selectorsWrapper: { paddingVertical: 10 },

  bookSelector: {
    gap: 14,
    paddingHorizontal: 16,
  },

  bookButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  secondRow: {
    marginTop: 10,
  },
  bookSecond: {
    marginRight: 10
  },

  bookText: { fontSize: 14, fontWeight: '600' },

  sectionList: { paddingHorizontal: 16 },

  sectionText: { fontSize: 13 },

  iconButton: {
    paddingLeft: 8
  },

  hadithCard: {
    flex: 1,
    borderRadius: 22,
    padding: 20,
    backgroundColor: 'transparent',
  },
  hadithHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 15,
    paddingLeft: 8
  },
  hadithContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingBottom: 16,
  },
  hadithNumber: {
    fontSize: 15,
    fontWeight: '600',
    paddingLeft: 10,
  },

  hadithText: {
    fontSize: 30.5,
    lineHeight: 45,
    textAlign: 'right',
    paddingLeft: 50,
    paddingTop: 18,
  },

  translationText: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    textAlign: 'left',
    paddingHorizontal: 8
  },
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
