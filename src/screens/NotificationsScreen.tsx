import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/hooks/useToast';
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});
export const NotificationsScreen: React.FC = () => {
    const toast = useToast();
    const [permissionStatus, setPermissionStatus] = useState<string>('unknown');
    const [expoPushToken, setExpoPushToken] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const notificationListener = useRef<{
        remove: () => void;
    } | undefined>(undefined);
    const responseListener = useRef<{
        remove: () => void;
    } | undefined>(undefined);
    useEffect(() => {
        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            console.log('Notificação recebida:', notification);
            const body = notification.request.content.body;
            toast.info(body ?? 'Nova notificação recebida');
        });
        responseListener.current =
            Notifications.addNotificationResponseReceivedListener((_response) => {
                toast.info('Usuário tocou na notificação!');
            });
        Notifications.getPermissionsAsync().then(({ status }) => {
            setPermissionStatus(status);
        });
        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, []);
    const requestPermission = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        setPermissionStatus(status);
        if (status === 'granted') {
            toast.success('Permissão concedida!');
            try {
                const token = await Notifications.getExpoPushTokenAsync({
                    projectId: 'seu-project-id',
                });
                setExpoPushToken(token.data);
            }
            catch {
                setExpoPushToken('(disponível em EAS Build)');
            }
        }
        else {
            toast.error('Permissão negada nas configurações do dispositivo');
        }
    };
    const scheduleLocalNotification = async () => {
        if (permissionStatus !== 'granted') {
            toast.error('Solicite permissão primeiro');
            return;
        }
        setIsLoading(true);
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Notificação de exemplo',
                    body: 'Esta notificação foi agendada pelo próprio aplicativo.',
                    data: { screen: 'Notifications', timestamp: Date.now() },
                    sound: 'default',
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                    seconds: 3,
                },
            });
            toast.success('Notificação agendada para 3 segundos!');
        }
        catch (error) {
            toast.error('Erro ao agendar notificação');
        }
        finally {
            setIsLoading(false);
        }
    };
    const cancelAll = async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
        toast.info('Notificações canceladas');
    };
    const getPermissionBadge = () => {
        if (permissionStatus === 'granted')
            return { label: 'Concedida', variant: 'success' as const };
        if (permissionStatus === 'denied')
            return { label: 'Negada', variant: 'error' as const };
        return { label: 'Não solicitada', variant: 'warning' as const };
    };
    const badge = getPermissionBadge();
    return (<ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20, gap: 20 }}>
      <Card>
        <Text className="text-xl font-semibold text-foreground mb-4">
          Permissão do sistema
        </Text>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-base text-muted">Notificações</Text>
          <Badge label={badge.label} variant={badge.variant}/>
        </View>

        <Button title="Solicitar Permissão" onPress={requestPermission} variant={permissionStatus === 'granted' ? 'outline' : 'primary'}/>

        {expoPushToken ? (<View className="mt-3 p-3 bg-secondary rounded-lg">
            <Text className="text-xs font-semibold text-muted mb-1">
              Expo Push Token:
            </Text>
            <Text className="text-xs text-foreground" numberOfLines={3}>
              {expoPushToken}
            </Text>
          </View>) : null}
      </Card>

      
      <Card>
        <Text className="text-xl font-semibold text-foreground mb-2">
          Notificação local
        </Text>
        <Text className="text-base text-muted mb-4 leading-6">
          Agendada pelo app, sem servidor. Funciona no simulador e no dispositivo.
        </Text>

        <View className="gap-3">
          <Button title="Agendar em 3 segundos" onPress={scheduleLocalNotification} loading={isLoading} variant="primary"/>
          <Button title="Cancelar agendadas" onPress={cancelAll} variant="outline"/>
        </View>
      </Card>

      <Card>
        <Text className="text-lg font-semibold text-foreground mb-3">
          Fluxo de push remoto
        </Text>
        {[
            { step: '1', desc: 'App registra e obtém Push Token' },
            { step: '2', desc: 'Token enviado ao seu servidor' },
            { step: '3', desc: 'Servidor envia para Expo Push API' },
            { step: '4', desc: 'Expo encaminha para FCM (Android) ou APNs (iOS)' },
            { step: '5', desc: 'Notificação entregue ao dispositivo' },
        ].map((item) => (<View key={item.step} className="flex-row gap-3 mb-2">
            <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
              <Text className="text-xs text-primary-foreground font-bold">
                {item.step}
              </Text>
            </View>
            <Text className="flex-1 text-xs text-muted">{item.desc}</Text>
          </View>))}
      </Card>
    </ScrollView>);
};
