import { AuthUser } from '@/store/auth.store';
import { setSecureItem, deleteSecureItem, getSecureItem, SECURE_KEYS, } from './secure-storage.service';
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface LoginResponse {
    user: AuthUser;
    token: string;
}
const MOCK_USERS: Record<string, AuthUser> = {
    'admin@demo.com': {
        id: 1,
        name: 'Admin Demo',
        email: 'admin@demo.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
    'user@demo.com': {
        id: 2,
        name: 'Usuário Demo',
        email: 'user@demo.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    },
};
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const user = MOCK_USERS[credentials.email.toLowerCase()];
    if (!user || credentials.password !== '123456') {
        throw new Error('E-mail ou senha inválidos.');
    }
    const token = `mock_token_${user.id}_${Date.now()}`;
    await setSecureItem(SECURE_KEYS.AUTH_TOKEN, token);
    return { user, token };
}
export async function logout(): Promise<void> {
    await deleteSecureItem(SECURE_KEYS.AUTH_TOKEN);
}
export async function getStoredToken(): Promise<string | null> {
    return getSecureItem(SECURE_KEYS.AUTH_TOKEN);
}
