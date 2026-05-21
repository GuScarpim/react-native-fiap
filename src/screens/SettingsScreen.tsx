import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useAppStore, useAuthStore, Theme } from '@/store';
import { logout } from '@/services/auth.service';
import { useToast } from '@/hooks/useToast';
export const SettingsScreen: React.FC = () => {
    const { t } = useTranslation();
    const { theme, setTheme } = useAppStore();
    const { user, clearAuth } = useAuthStore();
    const toast = useToast();
    const THEMES: {
        value: Theme;
        label: string;
    }[] = [
        { value: 'light', label: t('light') },
        { value: 'dark', label: t('dark') },
        { value: 'system', label: t('system') },
    ];
    const handleLogout = () => {
        Alert.alert('Sair', 'Tem certeza que deseja sair?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Sair',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await logout();
                        clearAuth();
                        toast.info('Sessão encerrada.');
                    }
                    catch {
                        toast.error('Não foi possível sair. Tente novamente.');
                    }
                },
            },
        ]);
    };
    return (<SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 40 }}>
        <View className="pt-2 pb-2">
          <Text className="text-3xl font-bold text-foreground">Ajustes</Text>
        </View>

        <Card>
          <View className="flex-row items-center gap-4">
            <Avatar uri={user?.avatar} name={user?.name} size="lg"/>
            <View className="flex-1">
              <Text className="text-xl font-semibold text-foreground">
                {user?.name ?? 'Usuário'}
              </Text>
              <Text className="text-base text-muted mt-1">{user?.email}</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text className="text-xl font-semibold text-foreground mb-4">
            {t('theme')}
          </Text>
          <View className="gap-2">
            {THEMES.map((option) => {
            const isActive = theme === option.value;
            return (<TouchableOpacity key={option.value} onPress={() => setTheme(option.value)} className={`px-4 py-4 rounded-lg ${isActive ? 'bg-primary' : 'bg-secondary'}`}>
                  <Text className={`text-base font-medium ${isActive
                    ? 'text-primary-foreground'
                    : 'text-secondary-foreground'}`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>);
        })}
          </View>
          <Text className="mt-4 text-base text-muted">
            {t('currentTheme', { theme })}
          </Text>
        </Card>

        <Card>
          <Text className="text-xl font-semibold text-foreground mb-4">
            {t('language')}
          </Text>
          <LanguageSwitcher />
        </Card>

        <Card>
          <Text className="text-xl font-semibold text-foreground mb-4">
            Sobre o app
          </Text>
          <View className="gap-3">
            <InfoRow label="Versão" value="1.0.0"/>
            <InfoRow label="Expo SDK" value="55"/>
            <InfoRow label="React Native" value="0.83.6"/>
          </View>
        </Card>

        <Button title="Sair da conta" onPress={handleLogout} variant="outline"/>
      </ScrollView>
    </SafeAreaView>);
};
const InfoRow: React.FC<{
    label: string;
    value: string;
}> = ({ label, value, }) => (<View className="flex-row justify-between items-center">
    <Text className="text-base text-muted">{label}</Text>
    <Text className="text-base font-medium text-foreground">{value}</Text>
  </View>);
