import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/hooks/useToast';
interface BiometricInfo {
    isSupported: boolean;
    isEnrolled: boolean;
    types: LocalAuthentication.AuthenticationType[];
}
function getAuthTypeName(type: LocalAuthentication.AuthenticationType): string {
    const names: Record<number, string> = {
        [LocalAuthentication.AuthenticationType.FINGERPRINT]: 'Impressão Digital',
        [LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION]: 'Face ID / Reconhecimento Facial',
        [LocalAuthentication.AuthenticationType.IRIS]: 'Reconhecimento de Íris',
    };
    return names[type] ?? 'Desconhecido';
}
export const BiometricScreen: React.FC = () => {
    const toast = useToast();
    const [biometricInfo, setBiometricInfo] = useState<BiometricInfo | null>(null);
    const [authResult, setAuthResult] = useState<string | null>(null);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    useEffect(() => {
        async function loadBiometricInfo() {
            const [isSupported, isEnrolled, types] = await Promise.all([
                LocalAuthentication.hasHardwareAsync(),
                LocalAuthentication.isEnrolledAsync(),
                LocalAuthentication.supportedAuthenticationTypesAsync(),
            ]);
            setBiometricInfo({ isSupported, isEnrolled, types });
        }
        loadBiometricInfo();
    }, []);
    const handleAuthenticate = async () => {
        setIsAuthenticating(true);
        setAuthResult(null);
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Autentique-se para continuar',
                cancelLabel: 'Cancelar',
                disableDeviceFallback: false,
                fallbackLabel: 'Usar PIN',
            });
            if (result.success) {
                setAuthResult('Autenticação bem-sucedida!');
                toast.success('Identidade confirmada!');
            }
            else {
                const errorMessages: Record<string, string> = {
                    UserCancel: 'Usuário cancelou',
                    UserFallback: 'Usuário escolheu PIN',
                    SystemCancel: 'Sistema cancelou',
                    PasscodeNotSet: 'PIN não configurado',
                    BiometryNotEnrolled: 'Biometria não cadastrada',
                    BiometryLockout: 'Biometria bloqueada (muitas tentativas)',
                };
                const message = errorMessages[result.error ?? ''] ?? result.error;
                setAuthResult(message ?? 'Autenticação falhou');
                toast.error(message ?? 'Autenticação falhou');
            }
        }
        catch {
            setAuthResult('Erro ao autenticar');
            toast.error('Erro inesperado');
        }
        finally {
            setIsAuthenticating(false);
        }
    };
    return (<ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Card>
        <Text className="text-lg font-semibold text-foreground mb-4">
          Suporte Biométrico
        </Text>

        {biometricInfo ? (<View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-muted">Hardware disponível</Text>
              <Badge label={biometricInfo.isSupported ? 'Sim' : 'Não'} variant={biometricInfo.isSupported ? 'success' : 'error'}/>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-base text-muted">Biometria cadastrada</Text>
              <Badge label={biometricInfo.isEnrolled ? 'Sim' : 'Não'} variant={biometricInfo.isEnrolled ? 'success' : 'warning'}/>
            </View>

            {biometricInfo.types.length > 0 && (<View>
                <Text className="text-base text-muted mb-2">Tipos suportados:</Text>
                {biometricInfo.types.map((type) => (<View key={type} className="mt-1">
                    <Text className="text-base text-foreground">
                      {getAuthTypeName(type)}
                    </Text>
                  </View>))}
              </View>)}
          </View>) : (<Text className="text-base text-muted">Verificando...</Text>)}
      </Card>

      <Card>
        <Text className="text-lg font-semibold text-foreground mb-4">
          Testar Autenticação
        </Text>

        <Button title={isAuthenticating ? 'Aguardando...' : 'Autenticar com Biometria'} onPress={handleAuthenticate} loading={isAuthenticating} disabled={!biometricInfo?.isSupported || !biometricInfo?.isEnrolled} variant="primary"/>

        {authResult && (<View className="mt-4 p-3 bg-secondary rounded-lg">
            <Text className="text-base text-foreground font-medium">
              {authResult}
            </Text>
          </View>)}

        {biometricInfo && !biometricInfo.isEnrolled && (<Text className="mt-3 text-sm text-muted">
            No simulador iOS: Hardware → Face ID → Enroll,
            depois Hardware → Face ID → Matching Face
          </Text>)}
      </Card>

      <Card>
        <Text className="text-base font-semibold text-foreground mb-2">
          Uso em produção
        </Text>
        <Text className="text-sm text-muted leading-5">
          Combine biometria com SecureStore: use a biometria para desbloquear
          o token armazenado de forma segura. O token NUNCA sai do Keychain.
          A biometria é apenas a chave para acessá-lo.
        </Text>
      </Card>
    </ScrollView>);
};
