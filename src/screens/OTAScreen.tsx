import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import { useFocusEffect } from '@react-navigation/native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/hooks/useToast';
import { getInstalledBundle, getRemoteBundle, hasRemoteUpdate, publishRemoteUpdate, installRemoteBundle, resetOtaDemo, delay, type OtaBundle, } from '@/features/ota/ota-demo.service';
interface UpdateStatus {
  checking: boolean;
  downloading: boolean;
  updateAvailable: boolean;
  error: string | null;
  lastChecked: Date | null;
}
const useSimulation = __DEV__ || Updates.isEmbeddedLaunch;
export const OTAScreen: React.FC = () => {
  const toast = useToast();
  const [installed, setInstalled] = useState<OtaBundle | null>(null);
  const [remote, setRemote] = useState<OtaBundle | null>(null);
  const [status, setStatus] = useState<UpdateStatus>({
    checking: false,
    downloading: false,
    updateAvailable: false,
    error: null,
    lastChecked: null,
  });
  const loadDemoState = useCallback(async () => {
    const [local, server] = await Promise.all([
      getInstalledBundle(),
      getRemoteBundle(),
    ]);
    setInstalled(local);
    setRemote(server);
    const pending = await hasRemoteUpdate();
    setStatus((s) => ({ ...s, updateAvailable: pending }));
  }, []);
  useFocusEffect(useCallback(() => {
    loadDemoState();
  }, [loadDemoState]));
  const checkForUpdates = async () => {
    setStatus((s) => ({ ...s, checking: true, error: null }));
    try {
      if (useSimulation) {
        await delay(1200);
        const pending = await hasRemoteUpdate();
        await loadDemoState();
        setStatus((s) => ({
          ...s,
          checking: false,
          updateAvailable: pending,
          lastChecked: new Date(),
        }));
        if (pending) {
          toast.info('Há um bundle mais novo no servidor (simulado).');
        }
        else {
          toast.success('Nenhuma atualização pendente.');
        }
        return;
      }
      const update = await Updates.checkForUpdateAsync();
      setStatus((s) => ({
        ...s,
        checking: false,
        updateAvailable: update.isAvailable,
        lastChecked: new Date(),
      }));
      if (update.isAvailable) {
        toast.info('Nova versão disponível.');
      }
      else {
        toast.success('App está atualizado.');
      }
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao verificar';
      setStatus((s) => ({ ...s, checking: false, error: message }));
      toast.error(message);
    }
  };
  const applyUpdate = async () => {
    setStatus((s) => ({ ...s, downloading: true }));
    try {
      if (useSimulation) {
        await delay(1500);
        const bundle = await installRemoteBundle();
        setInstalled(bundle);
        setStatus((s) => ({
          ...s,
          downloading: false,
          updateAvailable: false,
        }));
        toast.success('Bundle instalado. Conteúdo atualizado sem nova build na loja.');
        return;
      }
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao aplicar';
      setStatus((s) => ({ ...s, downloading: false, error: message }));
      toast.error(message);
    }
  };
  const handlePublishOnServer = async () => {
    await publishRemoteUpdate('v2');
    await loadDemoState();
    toast.info('Update publicado no servidor (simulado).');
  };
  const handleResetDemo = async () => {
    await resetOtaDemo();
    await loadDemoState();
    toast.info('Demonstração reiniciada (v1 no app e no servidor).');
  };
  return (<ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 40 }}>
    {useSimulation && (<View className="border border-border rounded-lg p-5 gap-3">
      <Text className="text-lg font-semibold text-foreground">
        Modo simulação (aula)
      </Text>
      <Text className="text-base text-muted leading-6">
        No Expo Go não existe OTA real. Esta tela reproduz o fluxo: publicar no
        servidor, verificar, baixar e aplicar — usando versões salvas no aparelho.
      </Text>
      <Text className="text-base text-muted leading-6">
        Na produção o mesmo fluxo usa EAS Update após um build instalado no
        dispositivo.
      </Text>
    </View>)}

    {installed && (<View className="rounded-lg p-5 border border-border" style={{ borderLeftWidth: 4, borderLeftColor: installed.accent }}>
      <Text className="text-sm text-muted mb-1">Bundle em execução</Text>
      <Text className="text-2xl font-bold text-foreground">{installed.version}</Text>
      <Text className="text-base text-foreground mt-2 leading-6">{installed.label}</Text>
    </View>)}

    <Card>
      <Text className="text-xl font-semibold text-foreground mb-4">
        Informações do ambiente
      </Text>
      <View className="gap-3">
        <InfoRow label="Versão do app (loja)" value={Constants.expoConfig?.version ?? '1.0.0'} />
        <InfoRow label="Runtime version" value={String(Updates.runtimeVersion ?? 'exposdk:55.0.0')} />
        <InfoRow label="Canal" value={Updates.channel ?? 'production'} />
        <InfoRow label="Modo" value={useSimulation ? 'Simulação (dev)' : 'Build com OTA'} />
        {remote && useSimulation && (<InfoRow label="Bundle no servidor" value={remote.version} />)}
      </View>
    </Card>

    {useSimulation && (<Card>
      <Text className="text-xl font-semibold text-foreground mb-2">
        Passo 1 — Publicar update
      </Text>
      <Text className="text-base text-muted mb-4 leading-6">
        Equivale ao comando eas update: o servidor passa a oferecer a versão v2.
        Estão na v1 até aplicarem o download.
      </Text>
      <View className="gap-3">
        <Button title="Publicar v2 no servidor (simulado)" onPress={handlePublishOnServer} variant="primary" />
        <Button title="Reiniciar demonstração" onPress={handleResetDemo} variant="outline" />
      </View>
    </Card>)}

    <Card>
      <Text className="text-xl font-semibold text-foreground mb-2">
        {useSimulation ? 'Passo 2 — Verificar e aplicar' : 'Verificar atualização'}
      </Text>

      {status.lastChecked && (<View className="mb-4 flex-row flex-wrap items-center gap-2">
        <Text className="text-base text-muted">
          Última verificação: {status.lastChecked.toLocaleTimeString('pt-BR')}
        </Text>
        <Badge label={status.updateAvailable ? 'Update disponível' : 'Atualizado'} variant={status.updateAvailable ? 'warning' : 'success'} />
      </View>)}

      <View className="gap-3">
        <Button title="Verificar atualizações" onPress={checkForUpdates} loading={status.checking} variant="outline" />
        {status.updateAvailable && (<Button title="Baixar e aplicar" onPress={applyUpdate} loading={status.downloading} variant="primary" />)}
      </View>
    </Card>

    <Card>
      <Text className="text-lg font-semibold text-foreground mb-3">
        O que não dá para simular sem build
      </Text>
      <Text className="text-base text-muted leading-6">
        Download real do bundle pelo expo-updates e canal EAS exigem um .ipa/.apk
        gerado antes (EAS Build ou expo run:ios). Para não estourar o tempo da aula,
        use este modo simulação e mostre o diagrama do fluxo real no slide.
      </Text>
    </Card>
  </ScrollView>);
};
const InfoRow: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => (<View className="flex-row items-start justify-between gap-3">
  <Text className="text-base text-muted flex-1">{label}</Text>
  <Text className="text-base font-medium text-foreground text-right max-w-[55%]">
    {value}
  </Text>
</View>);
