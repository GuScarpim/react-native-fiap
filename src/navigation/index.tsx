import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getThemeColors } from '@/theme/colors';
import { useAuthStore } from '@/store';
import type { AuthStackParamList, AppStackParamList, TabParamList, } from './types';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { ShowcaseScreen } from '@/screens/ShowcaseScreen';
import { PostsScreen } from '@/features/posts/screens/PostsScreen';
import { PostDetailScreen } from '@/features/posts/screens/PostDetailScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { AnimationsScreen } from '@/screens/AnimationsScreen';
import { OTAScreen } from '@/screens/OTAScreen';
import { ImagePickerScreen } from '@/screens/ImagePickerScreen';
import { NotificationsScreen } from '@/screens/NotificationsScreen';
import { BiometricScreen } from '@/screens/BiometricScreen';
import { PerformanceScreen } from '@/screens/PerformanceScreen';
import { I18nScreen } from '@/screens/I18nScreen';
import { OfflineScreen } from '@/screens/OfflineScreen';
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const MainTabs: React.FC = () => {
    const colorScheme = useColorScheme();
    const palette = getThemeColors(colorScheme);
    const isDark = colorScheme === 'dark';
    return (<Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarIcon: () => null,
            tabBarLabelStyle: { fontSize: 15, fontWeight: '500' },
            tabBarActiveTintColor: palette.primary,
            tabBarInactiveTintColor: palette.text.secondary,
            tabBarStyle: {
                backgroundColor: isDark ? palette.card : '#FFFFFF',
                borderTopColor: palette.border,
                paddingTop: 4,
            },
        }}>
      <Tab.Screen name="Showcase" component={ShowcaseScreen} options={{ title: 'Início' }}/>
      <Tab.Screen name="Posts" component={PostsScreen} options={{ title: 'Posts' }}/>
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ajustes' }}/>
    </Tab.Navigator>);
};
const AuthNavigator: React.FC = () => (<AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen}/>
  </AuthStack.Navigator>);
const AppNavigator: React.FC = () => {
    const colorScheme = useColorScheme();
    const palette = getThemeColors(colorScheme);
    const isDark = colorScheme === 'dark';
    return (<AppStack.Navigator screenOptions={{
            headerStyle: { backgroundColor: isDark ? palette.card : palette.header },
            headerTintColor: isDark ? palette.text.primary : palette.primaryForeground,
            headerTitleStyle: { fontWeight: '600', fontSize: 17 },
            contentStyle: { backgroundColor: palette.background },
        }}>
      <AppStack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }}/>
      <AppStack.Screen name="Animations" component={AnimationsScreen} options={{ title: 'Animações' }}/>
      <AppStack.Screen name="ImagePicker" component={ImagePickerScreen} options={{ title: 'Seleção de imagem' }}/>
      <AppStack.Screen name="OTA" component={OTAScreen} options={{ title: 'Atualização OTA' }}/>
      <AppStack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notificações' }}/>
      <AppStack.Screen name="Biometric" component={BiometricScreen} options={{ title: 'Biometria' }}/>
      <AppStack.Screen name="Performance" component={PerformanceScreen} options={{ title: 'Performance' }}/>
      <AppStack.Screen name="I18n" component={I18nScreen} options={{ title: 'Internacionalização' }}/>
      <AppStack.Screen name="Offline" component={OfflineScreen} options={{ title: 'Offline e armazenamento' }}/>
      <AppStack.Screen name="PostDetail" component={PostDetailScreen} options={({ route }) => ({ title: route.params.title })}/>
    </AppStack.Navigator>);
};
export const AppRoutes: React.FC = () => {
    const colorScheme = useColorScheme();
    const { isAuthenticated } = useAuthStore();
    const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
    return (<NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>);
};
