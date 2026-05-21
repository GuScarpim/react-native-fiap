import Toast from 'react-native-toast-message';
export function useToast() {
    return {
        success: (message: string, title = 'Sucesso') => {
            Toast.show({
                type: 'success',
                text1: title,
                text2: message,
                visibilityTime: 3000,
                position: 'top',
            });
        },
        error: (message: string, title = 'Erro') => {
            Toast.show({
                type: 'error',
                text1: title,
                text2: message,
                visibilityTime: 4000,
                position: 'top',
            });
        },
        info: (message: string, title = 'Informação') => {
            Toast.show({
                type: 'info',
                text1: title,
                text2: message,
                visibilityTime: 3000,
                position: 'top',
            });
        },
        hide: () => Toast.hide(),
    };
}
