# ⚡ React Native Showcase — FIAP

> Boilerplate React Native **moderno, didático e completo** para aulas práticas.  
> Cada feature vem documentada inline no código para facilitar o ensino.

---

## 📋 Índice

- [Stack Tecnológica](#stack)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Setup](#setup)
- [Credenciais Demo](#credenciais)
- [Estrutura de Pastas](#estrutura)
- [Fluxo de Navegação](#navegacao)
- [Como Usar na Aula](#aula)
- [OTA Updates](#ota)
- [CI/CD com EAS](#cicd)

---

## 🛠️ Stack Tecnológica <a name="stack"></a>

| Categoria | Tecnologia | Versão |
|-----------|-----------|--------|
| Framework | React Native + Expo SDK | 55 |
| Linguagem | TypeScript | 5.9 |
| Estilização | NativeWind (Tailwind) | 4.x |
| Estado Global | Zustand | 5.x |
| Data Fetching | TanStack Query v5 | 5.x |
| Formulários | react-hook-form + Zod | 7.x / 3.x |
| Navegação | React Navigation v7 | 7.x |
| Animações | react-native-reanimated | 4.x |
| i18n | i18next + react-i18next | 26.x |
| Armazenamento | AsyncStorage + SecureStore | - |
| Performance | FlashList (@shopify) | - |
| API Client | Axios | 1.x |

---

## 🚀 Funcionalidades <a name="funcionalidades"></a>

| # | Feature | Status | Libs |
|---|---------|--------|------|
| 1 | Login / Logout / Persistência | ✅ | react-hook-form, zod, SecureStore |
| 2 | API Real com Cache | ✅ | TanStack Query, Axios |
| 3 | Infinite Scroll | ✅ | useInfiniteQuery, FlatList |
| 4 | Toast / Snackbar Global | ✅ | react-native-toast-message |
| 5 | Dark Mode Completo | ✅ | NativeWind, Zustand |
| 6 | Animações 60fps | ✅ | react-native-reanimated |
| 7 | Image Picker | ✅ | expo-image-picker |
| 8 | Push Notifications | ✅ | expo-notifications |
| 9 | Biometria (Face ID / Digital) | ✅ | expo-local-authentication |
| 10 | OTA Updates | ✅ | expo-updates |
| 11 | Offline First / SecureStore | ✅ | AsyncStorage, SecureStore |
| 12 | Performance (FlashList, memo) | ✅ | @shopify/flash-list |
| 13 | i18n Avançado + Intl API | ✅ | i18next |
| 14 | Navegação (Stack + Tabs) | ✅ | React Navigation |
| 15 | Design System (10+ componentes) | ✅ | NativeWind |
| 16 | Feature-based Architecture | ✅ | - |
| 17 | CI/CD (documentação) | 📖 | EAS Build/Submit/Update |

---

## 🏗️ Arquitetura <a name="arquitetura"></a>

```
Feature-Based Architecture
└── src/
    ├── features/           # Domínios de negócio
    │   ├── auth/           # Login, validação, schema
    │   └── posts/          # API posts, serviço, tipos
    ├── screens/            # Telas de demo (showcase)
    ├── components/ui/      # Design system (Button, Input, Card...)
    ├── navigation/         # React Navigation (stack + tabs)
    ├── providers/          # Context providers (QueryProvider)
    ├── store/              # Zustand stores (app + auth)
    ├── services/           # Serviços externos (auth, secureStorage)
    ├── hooks/              # Custom hooks reutilizáveis
    ├── i18n/               # Internacionalização (en + pt-BR)
    ├── api/                # Axios client
    └── theme/              # Cores e tokens de design
```

### Fluxo de Autenticação

```
App Start
│
├── AsyncStorage (Zustand persist) → isAuthenticated?
│   ├── false → AuthNavigator → LoginScreen
│   └── true  → AppNavigator → MainTabs (Showcase)
│
Login
│
├── react-hook-form + zod → validação
├── authService.login()   → mock/API
├── SecureStore           → salva token (criptografado)
└── useAuthStore.setAuth()→ troca para AppNavigator
```

---

## ⚙️ Setup <a name="setup"></a>

### Pré-requisitos

```bash
node >= 18
npm >= 9
# iOS: Xcode 15+
# Android: Android Studio Giraffe+
```

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/boilerplate-react-native.git
cd boilerplate-react-native

# Instale as dependências
npm install

# Inicie o app
npm start
# Pressione 'i' para iOS ou 'a' para Android
```

### iOS Simulator

```bash
npm run ios
```

### Android Emulator

```bash
npm run android
```

---

## 🔑 Credenciais Demo <a name="credenciais"></a>

| E-mail | Senha | Perfil |
|--------|-------|--------|
| `admin@demo.com` | `123456` | Admin Demo |
| `user@demo.com` | `123456` | Usuário Demo |

---

## 📁 Estrutura de Pastas <a name="estrutura"></a>

```
boilerplate-react-native/
├── App.tsx                          # Ponto de entrada (index.js)
├── app.json                         # Config Expo (plugins, permissions)
├── babel.config.js                  # Babel (NativeWind, path alias @/)
├── tailwind.config.js               # Config NativeWind/Tailwind
├── tsconfig.json                    # TypeScript (strict mode)
├── eslint.config.js                 # ESLint flat config
├── global.css                       # CSS global (NativeWind tokens)
│
├── assets/                          # Imagens, ícones, splash
│
└── src/
    ├── App.tsx                      # Providers + raiz
    │
    ├── api/
    │   ├── client.ts                # Axios (interceptors, token injection)
    │   └── endpoints.ts             # URLs das APIs
    │
    ├── components/
    │   ├── ErrorBoundary.tsx        # Captura erros JS globais
    │   ├── LanguageSwitcher.tsx     # Switch de idioma
    │   └── ui/                      # Design System
    │       ├── Button.tsx           # Botão (primary/secondary/outline)
    │       ├── Card.tsx             # Card container
    │       ├── Input.tsx            # Input com label/error/ícone
    │       ├── Avatar.tsx           # Avatar com fallback
    │       ├── Badge.tsx            # Badge colorido por variante
    │       ├── Loader.tsx           # Spinner (full-screen ou inline)
    │       ├── EmptyState.tsx       # Estado vazio para listas
    │       └── Skeleton.tsx         # Skeleton loading animado
    │
    ├── features/
    │   ├── auth/
    │   │   ├── screens/
    │   │   │   └── LoginScreen.tsx  # react-hook-form + zod
    │   │   └── validators/
    │   │       └── login.schema.ts  # Schema zod do login
    │   └── posts/
    │       ├── screens/
    │       │   ├── PostsScreen.tsx      # TanStack Query + Infinite Scroll
    │       │   └── PostDetailScreen.tsx # useQuery por ID
    │       ├── services/
    │       │   └── posts.service.ts     # Calls à JSONPlaceholder API
    │       └── types/
    │           └── post.types.ts        # DTOs (Post, PaginatedResponse)
    │
    ├── hooks/
    │   ├── useColorScheme.ts        # dark/light do sistema + store
    │   ├── useDebounce.ts           # debounce genérico
    │   └── useToast.ts              # Wrapper do react-native-toast-message
    │
    ├── i18n/
    │   ├── index.ts                 # Config i18next
    │   ├── detector.ts              # Detecção de idioma do dispositivo
    │   ├── types.d.ts               # Tipagem das chaves
    │   └── resources/
    │       ├── en/common.json       # Traduções inglês
    │       └── pt-BR/common.json    # Traduções português BR
    │
    ├── navigation/
    │   ├── index.tsx                # Root Navigator (Auth Guard)
    │   └── types.ts                 # Tipagem das rotas
    │
    ├── providers/
    │   └── QueryProvider.tsx        # TanStack Query + configuração
    │
    ├── screens/
    │   ├── ShowcaseScreen.tsx       # Hub central (todas as demos)
    │   ├── SettingsScreen.tsx       # Tema, idioma, logout
    │   ├── AnimationsScreen.tsx     # Reanimated demos
    │   ├── BiometricScreen.tsx      # Face ID / impressão digital
    │   ├── OTAScreen.tsx            # Expo Updates demo
    │   ├── ImagePickerScreen.tsx    # Câmera + galeria
    │   ├── NotificationsScreen.tsx  # Local + push notifications
    │   ├── PerformanceScreen.tsx    # memo, useCallback, FlashList
    │   ├── I18nScreen.tsx           # i18n + Intl API
    │   └── OfflineScreen.tsx        # AsyncStorage vs SecureStore
    │
    ├── services/
    │   ├── auth.service.ts          # Login/logout + mock API
    │   └── secure-storage.service.ts# Wrapper SecureStore (Keychain)
    │
    ├── store/
    │   ├── index.ts                 # Barrel export
    │   ├── app.store.ts             # Tema, idioma (Zustand + persist)
    │   └── auth.store.ts            # Auth state (Zustand + persist)
    │
    ├── theme/
    │   └── colors.ts                # Tokens de cores (light/dark)
    │
    └── utils/
        ├── dates.ts                 # Utilitários de data
        └── format.ts                # Formatadores
```

---

## 🗺️ Fluxo de Navegação <a name="navegacao"></a>

```
NavigationContainer
│
├── AuthStack (isAuthenticated = false)
│   └── LoginScreen
│
└── AppStack (isAuthenticated = true)
    ├── MainTabs (Bottom Tab Navigator)
    │   ├── Tab 1: ShowcaseScreen  ← Hub central
    │   ├── Tab 2: PostsScreen     ← API + Infinite Scroll
    │   └── Tab 3: SettingsScreen  ← Config + Logout
    │
    ├── AnimationsScreen     ← push desde Showcase
    ├── ImagePickerScreen    ← push desde Showcase
    ├── BiometricScreen      ← push desde Showcase
    ├── OTAScreen            ← push desde Showcase
    ├── NotificationsScreen  ← push desde Showcase
    ├── PerformanceScreen    ← push desde Showcase
    ├── I18nScreen           ← push desde Showcase
    ├── OfflineScreen        ← push desde Showcase
    └── PostDetailScreen     ← push desde PostsScreen
```

## 📝 Licença

MIT — Livre para uso educacional.

---

*Desenvolvido para as aulas de React Native — FIAP*
