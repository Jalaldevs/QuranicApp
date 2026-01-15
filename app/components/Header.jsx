import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  StatusBar,
  useColorScheme,
  SafeAreaView,
  Image,
  Text,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import ThemedView from '../components/ThemedView';
import { Link, usePathname } from 'expo-router';
import surahs from '../constants/surahs';
import { booksFrontEnd, BOOKS } from '../constants/sunnahBooks';

const Header = () => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? Colors.dark : Colors.light;

  const [searchMenu, setSearchMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchSource, setSearchSource] = useState('quran');
  const [quranSearched, setQuranSearched] = useState([]);

  const inputRef = useRef(null);

  const pathname = usePathname();

  useEffect(() => {
    setSearchMenu(false);
  }, [pathname]);

  const inputIsMatching = (value) => {
    if (searchSource === 'quran') {
      const results = surahs.filter((s) =>
        s.latin.toLowerCase().includes(value.toLowerCase())
      );
      setQuranSearched(results);
    }
  };

  useEffect(() => {
    if (searchValue.trim().length > 0) {
      inputIsMatching(searchValue);
    } else {
      setQuranSearched([]);
    }
  }, [searchValue, searchSource]);

  return (
    <>
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />

      <SafeAreaView style={{ backgroundColor: theme.background }}>
        <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
          {/* Left */}
          <View style={styles.left}>
            <Image
              source={require('../../assets/images/quranic-logo-horizontal.png')}
              style={{ width: 220, height: 55 }}
            />
          </View>

          {/* Right */}
          <View style={styles.right}>
            <TouchableOpacity
              onPress={() => setSearchMenu(true)}
              style={styles.icon}
            >
              <Ionicons name="search-outline" size={24} color={theme.text} />
            </TouchableOpacity>

            <Link href={`/secondary/scheme`} asChild>
              <TouchableOpacity style={styles.icon}>
                <Ionicons name="moon-outline" size={24} color={theme.text} />
              </TouchableOpacity>
            </Link>

            <Link href={`/secondary/settings?back=${pathname}`} asChild>
              <TouchableOpacity style={[styles.icon, styles.headerIcon]}>
                <Ionicons name="settings-outline" size={24} color={theme.text} />
              </TouchableOpacity>
            </Link>
          </View>
        </ThemedView>
      </SafeAreaView>

      {/* Search Modal */}
      <Modal
        visible={searchMenu}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSearchMenu(false)}
      >
        <ThemedView
          style={[
            styles.searchOverlay,
            {
              backgroundColor:
                scheme === 'dark'
                  ? 'rgba(0,0,0,0.6)'
                  : 'rgba(0,0,0,0.25)',
            },
          ]}
        >
          <View
            style={[
              styles.searchSheet,
              { backgroundColor: theme.surface },
            ]}
          >
            <View
              style={[
                styles.searchHeader,
                { borderBottomColor: theme.border },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={24}
                color={theme.icon}
              />

              <TextInput
                ref={inputRef}
                autoFocus
                placeholder={
                  searchSource === 'quran'
                    ? 'Search Qur’an...'
                    : 'Search Sunnah...'
                }
                placeholderTextColor={theme.muted}
                value={searchValue}
                onChangeText={(text) => {
                  setSearchValue(text);
                }}
                style={[
                  styles.input,
                  { color: theme.text },
                ]}
              />

              <TouchableOpacity onPress={() => setSearchMenu(false)}>
                <Ionicons
                  name="close-outline"
                  size={34}
                  color={theme.icon}
                />
              </TouchableOpacity>
            </View>

            {/* SOURCE SELECTOR */}
            <View style={styles.sourceSelector}>
              {/* QURAN */}
              <Pressable
                onPress={() => setSearchSource('quran')}
                style={({ pressed }) => [
                  styles.sourceButton,
                  {
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                    borderColor: scheme === 'dark' ? '#4b5563' : '#ccc',
                    backgroundColor:
                      scheme === 'dark' && searchSource !== 'quran'
                        ? '#1e293b'
                        : 'transparent',
                  },
                  searchSource === 'quran' && {
                    borderColor: '#1976d2',
                    backgroundColor:
                      scheme === 'dark' ? '#1e3a8a' : '#e3f2fd',
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      searchSource === 'quran'
                        ? scheme === 'dark'
                          ? '#fff'
                          : '#1976d2'
                        : theme.text,
                    fontWeight: '600',
                  }}
                >
                  Qur’an
                </Text>
              </Pressable>

              {/* SUNNAH */}
              <Pressable
                onPress={() => setSearchSource('sunnah')}
                style={({ pressed }) => [
                  styles.sourceButton,
                  {
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                    borderColor: scheme === 'dark' ? '#4b5563' : '#ccc',
                    backgroundColor:
                      scheme === 'dark' && searchSource !== 'sunnah'
                        ? '#1e293b'
                        : 'transparent',
                  },
                  searchSource === 'sunnah' && {
                    borderColor: '#1976d2',
                    backgroundColor:
                      scheme === 'dark' ? '#1e3a8a' : '#e3f2fd',
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      searchSource === 'sunnah'
                        ? scheme === 'dark'
                          ? '#fff'
                          : '#1976d2'
                        : theme.text,
                    fontWeight: '600',
                  }}
                >
                  Sunnah
                </Text>
              </Pressable>
            </View>

            <View style={{ flex: 1, padding: 16 }}>
              {searchValue.length > 0 
              && searchSource === 'quran' ? (
                <FlatList
                  data={quranSearched}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <Text>
                      {item.latin}
                    </Text>
                )}
                />
              ) : (
                <View>
                  <Text style={[styles.searchExamples, { color: theme.text }]}>
                    Examples...
                  </Text>
                  <Text style={[styles.searchExamples, { color: theme.text }]}>
                    Al-Fatiha, Surah 55, 6:23
                  </Text>
                  <Text style={[styles.searchExamples, { color: theme.text }]}>
                    bukhari 552, nasai 123, abudawud 598,
                  </Text>
                  <Text style={[styles.searchExamples, { color: theme.text }]}>
                    muslim 123, tirmidhi 332, ibnmajah 52,
                  </Text>
                  <Text style={[styles.searchExamples, { color: theme.text }]}>
                    malik 61, nawawi 31, qudsi 10
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ThemedView>
      </Modal>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 9,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    paddingRight: 35,
    marginLeft: 10,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
  headerIcon: {
    marginLeft: 8,
  },
  searchOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  searchSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '80%',
  },
  searchHeader: {
    alignItems: 'center',
    paddingHorizontal: 26,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
  },
  searchExamples: {
    marginBottom: 7,
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingLeft: 8,
    fontWeight: '500',
  },

  /* selector styles */
  sourceSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  sourceButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
});
