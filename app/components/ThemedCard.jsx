import React from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import Colors from '../constants/Colors';

const ThemedCard = ({ children, style, intensity = 25 }) => {
    const scheme = useColorScheme();
    const theme = scheme === 'dark' ? Colors.dark : Colors.light;

    return (
        <View
        style={[
            styles.wrapper,
            {
            backgroundColor: theme.cardFallback,
            },
            style,
        ]}
        >
        <BlurView
            intensity={intensity}
            tint={scheme}
            style={StyleSheet.absoluteFill}
        />
        {children}
        </View>
    );
    };

    export default ThemedCard;

    const styles = StyleSheet.create({
    wrapper: {
        overflow: 'hidden',
    },
});
