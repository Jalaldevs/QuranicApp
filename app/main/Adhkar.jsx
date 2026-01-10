import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { useFonts } from 'expo-font';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import ThemedView from '../components/ThemedView';
import ThemedCard from '../components/ThemedCard';
import Colors from '../constants/Colors';
import categories from '../constants/adhkarCategories';
import adhkarData from '../constants/adhkarData';

const Adhkar = () => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? Colors.dark : Colors.light;

  const [selected, setSelected] = useState(categories[0]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [languagesMenu, setLanguagesMenu] = useState(false);
  const [translations, setTranslations] = useState([]);

  const [fontsLoaded] = useFonts({
    UthmanicHafs: require('../../assets/fonts/KFGQPC-Uthmanic-Script-HAFS-Regular.otf'),
  });

  const fixArabic = (t) => t.normalize('NFC');

  const loadAdhkar = (key) => {
    setLoading(true);
    setTimeout(() => {
      const data = adhkarData[key] || [];
      setItems(
        data.map((d) => ({
          ...d,
          arabic: fixArabic(d.arabic),
        }))
      );
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    if (fontsLoaded) loadAdhkar(selected.id);
  }, [selected, fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <>
      <Header />
      <ThemedView style={styles.container}>
        {/* Selector horizontal */}
        <View style={styles.selectorContainer}>
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectorScroll}
            renderItem={({ item }) => {
              const active = item.id === selected.id;
              return (
                <TouchableOpacity
                  onPress={() => setSelected(item)}
                  style={[
                    styles.selectorButton,
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
                    styles.selectorText, 
                    { 
                      color: active 
                        ? (scheme === 'dark' ? '#fff' : theme.text)
                        : (scheme === 'dark' ? '#e2e8f0' : theme.text)
                    }
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Lista de adhkar */}
        <ThemedCard intensity={18} style={styles.card}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.primary} />
          ) : (
            <FlatList
              data={items}
              keyExtractor={(i) => i.id.toString()}
              contentContainerStyle={{ gap: 18, paddingBottom: 30 }}
              renderItem={({ item }) => (
                <View>
                  <View style={styles.dhikrHeader}>
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
                  <View style={styles.adhkarBlock}>
                    <Text
                      style={[
                        styles.arabic,
                        { fontFamily: 'UthmanicHafs', color: theme.text },
                      ]}
                    >
                      {item.arabic}
                    </Text>

                    <Text style={[styles.translation, { color: theme.muted }]}>
                      {item.translation}
                    </Text>
                    <Text style={[styles.translation, { color: theme.text, fontWeight: 'bold' }]}>
                      {item.source}
                    </Text>
                  </View>
                </View>
              )}
            />
          )}
        </ThemedCard>
      </ThemedView>
      {languagesMenu && (
        <ThemedView style={styles.languagesOverlay}>
          <View style={styles.languagesSheet}>
            <View style={styles.languagesHeader}>
              <Text style={styles.languagesTitle}>Translations</Text>
              <TouchableOpacity onPress={() => setLanguagesMenu(false)}>
                <Ionicons name="close-outline" size={34} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={translations}
              numColumns={2}
              persistentScrollbar={true} 
              keyExtractor={item => item}
              contentContainerStyle={styles.languagesList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.languagesItem,
                    item === selectedTranslation &&
                      styles.languagesItemActive,
                  ]}
                  onPress={() => {
                    setSelectedTranslation(item);
                    setLanguagesMenu(false);
                  }}
                >
                  <Text style={styles.languagesText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </ThemedView>
      )}
    </>
  );
};

export default Adhkar;

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: 10, paddingHorizontal : 16, gap: 16 },
  
  selectorScroll: { gap: 10 },

  selectorButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  selectorText: { fontSize: 14, fontWeight: '600' },

  card: {
    flex: 1,
    borderRadius: 22,
    padding: 20,
    elevation: 12,
  },

  adhkarBlock: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCC',
    paddingBottom: 12,
  },

  arabic: {
    fontSize: 30,
    textAlign: 'right',
    paddingLeft: 30,
    paddingTop: 31,
    paddingBottom: 15
  },

  iconButton: {
    position: 'absolute',
    right: 0,
  },

  translation: {
    fontSize: 16.5,
    lineHeight: 22,
  },

  languagesOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },

  languagesSheet: {
    backgroundColor: '#fff',
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
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },

  languagesItemActive: {
    backgroundColor: '#dbeafe',
  },

  languagesText: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
