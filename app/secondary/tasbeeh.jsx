import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import ThemedView from '../components/ThemedView';
import SecondaryHeader from '../components/SecondaryHeader';
const Tasbeeh = () => {
    const [count, setCount] = useState(0);

    const increment = () => {
        if (count === 99) {
            setCount(0)
        }
        setCount(count => count + 1);
    };

    const reset = () => {
        setCount(0);
    };

    return (
      <>
        <SecondaryHeader/>
        <ThemedView style={styles.container}>
          <Pressable onPress={increment} style={styles.counterButton}>
              <Text style={styles.countText}>{count}</Text>
          </Pressable>
          <Pressable onPress={reset} style={styles.resetButton}>
              <Text style={styles.resetText}>Reset</Text>
          </Pressable>
        </ThemedView>
      </>
    );
};

export default Tasbeeh;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginBottom: 55
  },
  counterButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 200,
    width: 230,
    height: 230,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  countText: {
    fontSize: 70,
    fontWeight: '700',
  },
  resetButton: {
    paddingHorizontal: 34,
    paddingVertical: 12,
    backgroundColor: '#0b98cfff',
    borderRadius: 12,
  },
  resetText: {
    color: '#f8f0f0ff',
    fontWeight: '700',
    fontSize: 20,
  },
});
