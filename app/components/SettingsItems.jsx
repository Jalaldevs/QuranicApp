import React from 'react';
import { StyleSheet, Text, View, Pressable, useColorScheme } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Colors from '.././constants/Colors'

const SettingsItem = ({ icon, label, onPress }) => {
    const colorScheme = useColorScheme()
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light

    return (
        <Pressable
        onPress={onPress}
        style={({ pressed }) => [
            styles.row,
            pressed && { opacity: 0.6 },
        ]}
        >
        <View style={styles.left}>
            <Ionicons name={icon} size={20} color={theme.iconFocused} />
            <Text style={[styles.label, { color: theme.text }]}>
            {label}
            </Text>
        </View>

        <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.muted}
        />
        </Pressable>
    );
    };

    export default SettingsItem;

    const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    label: {
        fontSize: 16,
    },
});