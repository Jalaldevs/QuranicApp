import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  useColorScheme, 
  SafeAreaView, 
  Image, 
  Text, 
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import ThemedView from '../components/ThemedView';
import { Link, usePathname } from 'expo-router';

const Header = () => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? Colors.dark : Colors.light;

  const [searchMenu, setSearchMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef(null);

  const pathname = usePathname(); // ejemplo: /main/quran o /adhkar/sunnah
  
  // Determinar sección basada en la ruta actual
  const getSection = () => {
    if (pathname.includes('quran')) return 'quran';
    if (pathname.includes('sunnah')) return 'sunnah';
    return 'all';
  };
  
  const section = getSection();

  // Search icon siempre visible
  const icons = [
    { name: 'search-outline' },
  ];

  // cerrar search al cambiar de ruta
  useEffect(() => {
    setSearchMenu(false);
  }, [pathname]);

  return (
    <>
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />

      <SafeAreaView style={{ backgroundColor: theme.background }}>
        <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
          {/* Left: Logo */}
          <View style={styles.left}>
            <Image
              source={require('../../assets/images/quranic-logo-horizontal.png')}
              style={{ width: 220, height: 55 }}
            />
          </View>

          {/* Right: Icons */}
          <View style={styles.right}>
            {icons.map((icon) => (
              <TouchableOpacity
                key={icon.name}
                onPress={() => setSearchMenu(true)} // abrir modal
                style={styles.icon}
              >
                <Ionicons name={icon.name} size={24} color={theme.text} />
              </TouchableOpacity>
            ))}
            <Link style={styles.headerIcon} href={`/secondary/settings?back=${pathname}`} asChild>
              <TouchableOpacity style={styles.icon}>
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
        <ThemedView style={styles.searchOverlay}>
          <View style={styles.searchSheet}>
            <View style={styles.searchHeader}>
              <Ionicons name='search-outline' size={24} />
              <TextInput
                ref={inputRef}
                autoFocus={true} // abre teclado automáticamente
                placeholder={
                  section === 'quran'
                    ? 'Search Quran...'
                    : section === 'sunnah'
                    ? 'Search Sunnah Here...'
                    : 'Search...'
                }
                placeholderTextColor={theme.title}
                value={searchValue}
                onChangeText={setSearchValue}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setSearchMenu(false)}>
                <Ionicons name="close-outline" size={34} />
              </TouchableOpacity>
            </View>

            {/* Aquí podrías agregar resultados filtrados si quieres */}
            <View style={{ flex: 1, padding: 16 }}>
              {searchValue.length > 0 && (
                <Text style={{ color: theme.text }}>Searching for "{searchValue}" in {section}</Text>
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
    paddingRight: 33,
    marginLeft: 10,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 8,
  },
  searchOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  searchSheet: {
    backgroundColor: '#fff',
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
    borderBottomColor: '#DDD',
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingLeft: 8,
    fontWeight: '500',
  },
});
