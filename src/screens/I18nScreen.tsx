import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'pt-BR', label: 'Português (BR)' },
];
export const I18nScreen: React.FC = () => {
    const { t, i18n: i18nInstance } = useTranslation();
    const currentLang = i18nInstance.language;
    const switchLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };
    const now = new Date();
    const formatCurrency = (value: number, locale: string, currency: string) => new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(value);
    const formatDate = (date: Date, locale: string) => new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
    const formatNumber = (value: number, locale: string) => new Intl.NumberFormat(locale).format(value);
    return (<ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16, gap: 16 }}>
      
      <Card>
        <Text className="text-lg font-semibold text-foreground mb-4">
          Trocar Idioma
        </Text>
        <View className="flex-row gap-2">
          {LANGUAGES.map((lang) => (<TouchableOpacity key={lang.code} onPress={() => switchLanguage(lang.code)} className={`flex-1 py-2 px-3 rounded-lg items-center ${currentLang === lang.code ? 'bg-primary' : 'bg-secondary'}`}>
              <Text className={currentLang === lang.code
                ? 'text-primary-foreground font-semibold text-base'
                : 'text-secondary-foreground text-base'}>
                {lang.label}
              </Text>
            </TouchableOpacity>))}
        </View>
        <View className="mt-3 flex-row items-center gap-2">
          <Text className="text-sm text-muted">Idioma atual:</Text>
          <Badge label={currentLang} variant="info"/>
        </View>
      </Card>

      
      <Card>
        <Text className="text-lg font-semibold text-foreground mb-3">
          t() — Tradução Básica
        </Text>
        <View className="gap-2">
          <FormatRow label="t('welcome')" value={t('welcome')}/>
          <FormatRow label="t('settings')" value={t('settings')}/>
          <FormatRow label="t('language')" value={t('language')}/>
        </View>
      </Card>

      
      <Card>
        <Text className="text-lg font-semibold text-foreground mb-3">
          Interpolação
        </Text>
        <View className="gap-2">
          <FormatRow label={`t('hello', {name: 'João'})`} value={t('hello', { name: 'João' })}/>
          <FormatRow label={`t('currentTheme', {theme: 'dark'})`} value={t('currentTheme', { theme: 'dark' })}/>
        </View>
      </Card>

      <Card>
        <Text className="text-lg font-semibold text-foreground mb-3">
          Intl API — Formatação Nativa
        </Text>
        <View className="gap-3">
          <View>
            <Text className="text-sm font-semibold text-muted mb-1">
              Moeda (R$):
            </Text>
            <Text className="text-base text-foreground">
              {formatCurrency(1234567.89, 'pt-BR', 'BRL')}
            </Text>
          </View>
          <View>
            <Text className="text-sm font-semibold text-muted mb-1">
              Moeda (US$):
            </Text>
            <Text className="text-base text-foreground">
              {formatCurrency(1234567.89, 'en-US', 'USD')}
            </Text>
          </View>
          <View>
            <Text className="text-sm font-semibold text-muted mb-1">
              Data (pt-BR):
            </Text>
            <Text className="text-base text-foreground">
              {formatDate(now, 'pt-BR')}
            </Text>
          </View>
          <View>
            <Text className="text-sm font-semibold text-muted mb-1">
              Data (en-US):
            </Text>
            <Text className="text-base text-foreground">
              {formatDate(now, 'en-US')}
            </Text>
          </View>
          <View>
            <Text className="text-sm font-semibold text-muted mb-1">
              Número:
            </Text>
            <View className="flex-row gap-4">
              <Text className="text-base text-foreground">
                BR: {formatNumber(1234567, 'pt-BR')}
              </Text>
              <Text className="text-base text-foreground">
                US: {formatNumber(1234567, 'en-US')}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </ScrollView>);
};
const FormatRow: React.FC<{
    label: string;
    value: string;
}> = ({ label, value, }) => (<View className="flex-row items-center justify-between gap-2">
    <Text className="text-sm text-muted font-mono flex-1">{label}</Text>
    <Text className="text-base text-foreground font-medium">{value}</Text>
  </View>);
