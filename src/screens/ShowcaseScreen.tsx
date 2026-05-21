import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store';
import type { TabScreenNavigationProp } from '@/navigation/types';
type DemoTarget =
    | 'Posts'
    | 'PostDetail'
    | 'Settings'
    | 'Animations'
    | 'Performance'
    | 'I18n'
    | 'ImagePicker'
    | 'Notifications'
    | 'Biometric'
    | 'Offline'
    | 'OTA';
interface DemoItem {
    title: string;
    description: string;
    screen: DemoTarget;
}
interface DemoSection {
    title: string;
    items: DemoItem[];
}
const SECTIONS: DemoSection[] = [
    {
        title: 'API e dados',
        items: [
            {
                title: 'Lista de posts',
                description: 'Consumo de API pública com cache, infinite scroll e atualização por gesto.',
                screen: 'Posts',
            },
            {
                title: 'Detalhe do post',
                description: 'Navegação com parâmetros e conteúdo carregado por ID.',
                screen: 'PostDetail',
            },
        ],
    },
    {
        title: 'Interface',
        items: [
            {
                title: 'Animações',
                description: 'Transições com Reanimated: fade, escala, deslocamento e sequências.',
                screen: 'Animations',
            },
            {
                title: 'Performance',
                description: 'Memoização, useCallback e comparação entre FlatList e FlashList.',
                screen: 'Performance',
            },
            {
                title: 'Internacionalização',
                description: 'Troca de idioma, formatação de datas, números e moeda com i18next.',
                screen: 'I18n',
            },
        ],
    },
    {
        title: 'Recursos do dispositivo',
        items: [
            {
                title: 'Seleção de imagem',
                description: 'Acesso à galeria e à câmera, com preview e permissões.',
                screen: 'ImagePicker',
            },
            {
                title: 'Notificações',
                description: 'Permissão do sistema e notificações locais agendadas.',
                screen: 'Notifications',
            },
            {
                title: 'Biometria',
                description: 'Autenticação local com impressão digital, Face ID ou PIN do dispositivo.',
                screen: 'Biometric',
            },
        ],
    },
    {
        title: 'Armazenamento',
        items: [
            {
                title: 'Offline e cache',
                description: 'AsyncStorage, SecureStore e persistência de dados no dispositivo.',
                screen: 'Offline',
            },
        ],
    },
    {
        title: 'Publicação',
        items: [
            {
                title: 'Atualização OTA',
                description: 'Versão em execução, canal de update e verificação sem nova build na loja.',
                screen: 'OTA',
            },
        ],
    },
    {
        title: 'App',
        items: [
            {
                title: 'Ajustes',
                description: 'Tema, idioma, perfil do usuário e encerramento de sessão.',
                screen: 'Settings',
            },
        ],
    },
];
export const ShowcaseScreen: React.FC = () => {
    const navigation = useNavigation<TabScreenNavigationProp>();
    const { user } = useAuthStore();
    const openDemo = (screen: DemoTarget) => {
        if (screen === 'Posts' || screen === 'Settings') {
            navigation.navigate(screen);
            return;
        }
        if (screen === 'PostDetail') {
            navigation.navigate('PostDetail', {
                postId: 1,
                title: 'Post de demonstração',
            });
            return;
        }
        navigation.navigate(screen);
    };
    return (<SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
            <View className="pt-6 pb-8">
                <Text className="text-3xl font-bold text-foreground leading-tight">
                    Demonstrações
                </Text>
                <Text className="text-lg text-muted mt-3 leading-7">
                    {user?.name
                        ? `Olá, ${user.name}. Escolha um tópico para abrir na aula.`
                        : 'Escolha um tópico para abrir na aula.'}
                </Text>
            </View>

            {SECTIONS.map((section) => (<View key={section.title} className="mb-10">
                <Text className="text-xl font-semibold text-foreground mb-4">
                    {section.title}
                </Text>

                <View className="gap-3">
                    {section.items.map((item) => (<Pressable key={item.title} onPress={() => openDemo(item.screen)} className="border border-border rounded-lg px-5 py-5 bg-card active:opacity-80">
                        <Text className="text-lg font-semibold text-foreground">
                            {item.title}
                        </Text>
                        <Text className="text-base text-muted mt-2 leading-6">
                            {item.description}
                        </Text>
                    </Pressable>))}
                </View>
            </View>))}
        </ScrollView>
    </SafeAreaView>);
};
