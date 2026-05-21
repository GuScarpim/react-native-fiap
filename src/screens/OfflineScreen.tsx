import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSecureItem, setSecureItem, deleteSecureItem, SECURE_KEYS, } from '@/services/secure-storage.service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/hooks/useToast';
const DEMO_CACHE_KEY = '@showcase:demo_cache';
interface CacheEntry {
  value: string;
  timestamp: string;
}
export const OfflineScreen: React.FC = () => {
  const toast = useToast();
  const [asyncData, setAsyncData] = useState<CacheEntry | null>(null);
  const [secureData, setSecureData] = useState<string | null>(null);
  useEffect(() => {
    loadStoredData();
  }, []);
  const loadStoredData = async () => {
    try {
      const raw = await AsyncStorage.getItem(DEMO_CACHE_KEY);
      if (raw)
        setAsyncData(JSON.parse(raw) as CacheEntry);
      const token = await getSecureItem(SECURE_KEYS.AUTH_TOKEN);
      setSecureData(token ? '(token presente — ' + token + ')' : null);
    }
    catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };
  const saveToAsyncStorage = async () => {
    const data: CacheEntry = {
      value: `Dado salvo em ${new Date().toLocaleTimeString('pt-BR')}`,
      timestamp: new Date().toISOString(),
    };
    await AsyncStorage.setItem(DEMO_CACHE_KEY, JSON.stringify(data));
    setAsyncData(data);
    toast.success('Salvo no AsyncStorage!');
  };
  const clearAsyncStorage = async () => {
    await AsyncStorage.removeItem(DEMO_CACHE_KEY);
    setAsyncData(null);
    toast.info('AsyncStorage limpo!');
  };
  const saveSecureDemo = async () => {
    await setSecureItem('demo_key', `secret_${Date.now()}`);
    setSecureData('(valor salvo — ' + `secret_${Date.now()})`);
    toast.success('Salvo no SecureStore (criptografado)!');
  };
  const clearSecureDemo = async () => {
    await deleteSecureItem('demo_key');
    setSecureData(null);
    toast.info('SecureStore limpo!');
  };
  return (<ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16, gap: 16 }}>

    <Card>
      <Text className="text-lg font-semibold text-foreground mb-4">
        AsyncStorage vs SecureStore
      </Text>
      <View className="gap-2">
        <CompareRow label="Criptografia" async="Texto plano" secure="AES-256" />
        <CompareRow label="Plataforma" async="iOS + Android" secure="iOS Keychain / Android Keystore" />
        <CompareRow label="Velocidade" async="Mais rápido" secure="Ligeiramente mais lento" />
        <CompareRow label="Uso ideal" async="Prefs, cache" secure="Tokens, senhas" />
      </View>
    </Card>


    <Card>
      <Text className="text-lg font-semibold text-foreground mb-2">
        AsyncStorage
      </Text>
      <Text className="text-sm text-muted mb-4">
        Persiste entre sessões. Dados visíveis se o dispositivo for rootado.
      </Text>

      {asyncData ? (<View className="p-3 bg-secondary rounded-lg mb-3">
        <Text className="text-sm text-foreground">{asyncData.value}</Text>
        <Text className="text-sm text-muted mt-1">
          {new Date(asyncData.timestamp).toLocaleString('pt-BR')}
        </Text>
      </View>) : (<View className="p-3 bg-secondary rounded-lg mb-3">
        <Text className="text-sm text-muted">Nenhum dado salvo</Text>
      </View>)}

      <View className="flex-row gap-2">
        <View className="flex-1">
          <Button title="Salvar" onPress={saveToAsyncStorage} variant="primary" />
        </View>
        <View className="flex-1">
          <Button title="Limpar" onPress={clearAsyncStorage} variant="outline" />
        </View>
      </View>
    </Card>


    <Card>
      <Text className="text-lg font-semibold text-foreground mb-2">
        SecureStore (Keychain)
      </Text>
      <Text className="text-sm text-muted mb-4">
        Criptografado pelo SO. Inacessível mesmo em dispositivos rootados.
      </Text>

      <View className="flex-row items-center gap-2 mb-3">
        <Text className="text-sm text-muted">Status:</Text>
        <Badge label={secureData ? 'Dado presente' : 'Vazio'} variant={secureData ? 'success' : 'default'} />
      </View>

      {secureData && (<Text className="text-sm text-muted mb-3">{secureData}</Text>)}

      <View className="flex-row gap-2">
        <View className="flex-1">
          <Button title="Salvar" onPress={saveSecureDemo} variant="primary" />
        </View>
        <View className="flex-1">
          <Button title="Limpar" onPress={clearSecureDemo} variant="outline" />
        </View>
      </View>
    </Card>


    <Card>
      <Text className="text-base font-semibold text-foreground mb-2">
        TanStack Query Cache
      </Text>
      <Text className="text-sm text-muted leading-5">
        O TanStack Query já implementa offline first automaticamente:
        {'\n'}• Dados em memória por 10 minutos (gcTime)
        {'\n'}• Exibe cache enquanto revalida em background
        {'\n'}• Para persistência em disco: use query-async-storage-persister
      </Text>
    </Card>
  </ScrollView>);
};
const CompareRow: React.FC<{
  label: string;
  async: string;
  secure: string;
}> = ({ label, async, secure }) => (<View className="flex-row items-start gap-2">
  <Text className="text-sm text-muted w-20">{label}:</Text>
  <Text className="text-sm text-foreground flex-1">{async}</Text>
  <Text className="text-sm text-foreground flex-1">{secure}</Text>
</View>);
