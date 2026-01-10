import React from 'react';
import { View, Text, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSearchParams, useLocalSearchParams } from 'expo-router'; // ✅ correcto
import Colors from '../constants/Colors';
import ThemedView from '../components/ThemedView';

const SecondaryHeader = ({ title = 'Back', back: backProp }) => {
    const theme = Colors[useColorScheme() ?? 'light'];
    const router = useRouter();
    // Compatibilidad: useSearchParams puede no estar exportado en algunas versiones;
    // preferimos useSearchParams si existe, luego useLocalSearchParams.
    const useSearch = typeof useSearchParams === 'function' ? useSearchParams : (typeof useLocalSearchParams === 'function' ? useLocalSearchParams : null);
    const params = useSearch ? useSearch() : {};
    const backParam = params?.back;

    // Prioriza la prop `back` pasada al componente, luego la query param `back`, si existe
    const backRoute = backProp ?? backParam;

    const handleBack = () => {
        if (backRoute) {
            // Asegurar que la ruta comience con '/'
            const target = backRoute.startsWith('/') ? backRoute : `/${backRoute}`;
            // Navegar al objetivo; usar push para asegurar que la navegación ocurra
            router.push(target);
            return; 
        }

        // Si no hay ruta explícita, intenta volver en el historial
        router.back();
    };

    return (
        <ThemedView style={styles.container}>
            <Pressable
                style={styles.backBtn}
                onPress={handleBack}
                hitSlop={8}
                accessibilityRole="button"
            >
                <Ionicons name="chevron-back" style={styles.backIcon} size={25} />
                <Text style={styles.backText}>Go Back</Text>
            </Pressable>
        </ThemedView>
    );
};

export default SecondaryHeader;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        color: '#0647fbff'
    },
    backIcon: {
        color: '#0647fbff'
    },
    backText: {
        fontSize: 20,
        marginLeft: 4,
        fontWeight: '600',
        color: '#0647fbff'
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
    },
});
