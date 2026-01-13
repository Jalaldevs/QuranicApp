import React from 'react';
import { Text, StyleSheet, useColorScheme } from 'react-native';
import Colors from '../constants/Colors';

const SectionHeader = ({ title }) => {
    const theme = Colors[useColorScheme() ?? 'light'];

    return (
        <Text style={[styles.text, { color: theme.dontKnow }]}>
        {title.toUpperCase()}
        </Text>
    );
};

export default SectionHeader;

const styles = StyleSheet.create({
    text: {
        fontSize: 13,
        letterSpacing: 1,
        marginVertical: 12,
        marginLeft: 4,
    },
});
