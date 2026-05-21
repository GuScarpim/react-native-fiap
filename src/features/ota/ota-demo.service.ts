import AsyncStorage from '@react-native-async-storage/async-storage';
export interface OtaBundle {
    version: string;
    label: string;
    accent: string;
}
export const OTA_BUNDLES: Record<string, OtaBundle> = {
    v1: {
        version: 'v1',
        label: 'Versão inicial publicada na loja',
        accent: '#6B7280',
    },
    v2: {
        version: 'v2',
        label: 'Correção de texto enviada por OTA (sem nova build)',
        accent: '#B91C1C',
    },
};
const KEYS = {
    installed: '@ota-demo:installed',
    remote: '@ota-demo:remote',
} as const;
export async function getInstalledBundle(): Promise<OtaBundle> {
    const id = (await AsyncStorage.getItem(KEYS.installed)) ?? 'v1';
    return OTA_BUNDLES[id] ?? OTA_BUNDLES.v1;
}
export async function getRemoteBundle(): Promise<OtaBundle> {
    const id = (await AsyncStorage.getItem(KEYS.remote)) ?? 'v1';
    return OTA_BUNDLES[id] ?? OTA_BUNDLES.v1;
}
export async function publishRemoteUpdate(versionId: keyof typeof OTA_BUNDLES): Promise<void> {
    await AsyncStorage.setItem(KEYS.remote, versionId);
}
export async function installRemoteBundle(): Promise<OtaBundle> {
    const remote = await getRemoteBundle();
    await AsyncStorage.setItem(KEYS.installed, remote.version);
    return remote;
}
export async function hasRemoteUpdate(): Promise<boolean> {
    const [installed, remote] = await Promise.all([
        AsyncStorage.getItem(KEYS.installed),
        AsyncStorage.getItem(KEYS.remote),
    ]);
    return (remote ?? 'v1') !== (installed ?? 'v1');
}
export async function resetOtaDemo(): Promise<void> {
    await AsyncStorage.multiSet([
        [KEYS.installed, 'v1'],
        [KEYS.remote, 'v1'],
    ]);
}
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
