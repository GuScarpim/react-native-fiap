import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { colorScheme as nativewindColorScheme } from 'nativewind';
import '../global.css';
import { AppRoutes } from './navigation';
import { QueryProvider } from './providers/QueryProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useColorScheme } from './hooks/useColorScheme';
import { useAppStore } from './store';
import '@/i18n';
export default function App() {
    const [isReady, setIsReady] = useState(false);
    const { language } = useAppStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 100);
        if (language) {
            try {
                const i18n = require('@/i18n').default;
                i18n.changeLanguage(language);
            }
            catch (error) {
                console.warn('Error changing language:', error);
            }
        }
        return () => clearTimeout(timer);
    }, [language]);
    useEffect(() => {
        nativewindColorScheme.set(isDark ? 'dark' : 'light');
    }, [isDark]);
    if (!isReady) {
        return (<View className="flex-1 items-center justify-center bg-background">
        <Text className="text-foreground">Carregando...</Text>
      </View>);
    }
    return (<ErrorBoundary>
      
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          
          <QueryProvider>
            <View className="flex-1 bg-background">
              <StatusBar style={isDark ? 'light' : 'dark'}/>
              <AppRoutes />
            </View>
          </QueryProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>

      
      <Toast />
    </ErrorBoundary>);
}
