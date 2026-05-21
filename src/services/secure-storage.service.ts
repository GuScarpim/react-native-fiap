import * as SecureStore from 'expo-secure-store';
export const SECURE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
} as const;
export async function setSecureItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
}
export async function getSecureItem(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
}
export async function deleteSecureItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
}
export async function hasSecureItem(key: string): Promise<boolean> {
    const value = await SecureStore.getItemAsync(key);
    return value !== null;
}
