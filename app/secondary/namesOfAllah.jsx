import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import ThemedView from '../components/ThemedView';
import ThemedCard from '../components/ThemedCard';
import SecondaryHeader from '../components/SecondaryHeader';
import Colors from '../constants/Colors';

const NamesOfAllah = () => {
  const scheme = 'light'; // o usar useColorScheme() si quieres soporte automático
  const theme = scheme === 'dark' ? Colors.dark : Colors.light;

  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const res = await fetch('https://asmaul-husna-api.vercel.app/api/all');
        const data = await res.json();
        const formatted = data.data.map(item => ({
          id: item.urutan,
          arabic: item.arab,
          latin: item.latin,
          arti: item.arti,
        }));
        setNames(formatted);
      } catch (err) {
        console.error('Error fetching names:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNames();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <SecondaryHeader />

      <Text style={[styles.title, { color: theme.primary }]}>
        Asma’ul Husna — 99 Names of Allah
      </Text>

      <ThemedCard intensity={15} style={styles.card}>
        {loading ? (
          <Text style={[styles.loadingText, { color: theme.muted }]}>
            Loading...
          </Text>
        ) : (
          <FlatList
            data={names}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ gap: 14, paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View style={[styles.nameItem, { borderBottomColor: theme.border }]}>
                <Text style={[styles.arabic, { color: theme.text }]}>{item.arabic}</Text>
                <Text style={[styles.latin, { color: theme.muted }]}>{item.latin}</Text>
              </View>
            )}
          />
        )}
      </ThemedCard>
    </ThemedView>
  );
};

export default NamesOfAllah;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  card: {
    flex: 1,
    borderRadius: 22,
    padding: 18,
    backgroundColor: 'transparent',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
  },
  nameItem: {
    paddingVertical: 12,
    gap: 4,
    borderBottomWidth: 0.5,
  },
  arabic: {
    fontSize: 28,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  latin: {
    fontSize: 16,
    fontWeight: '600',
  },
  translation: {
    fontSize: 15,
  },
});
