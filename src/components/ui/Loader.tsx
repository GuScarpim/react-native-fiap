import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getThemeColors } from '@/theme/colors';
interface LoaderProps {
    message?: string;
    fullScreen?: boolean;
    size?: 'small' | 'large';
}
export const Loader: React.FC<LoaderProps> = ({ message, fullScreen = false, size = 'large', }) => {
    const colorScheme = useColorScheme();
    const palette = getThemeColors(colorScheme);
    const content = (<View className="items-center justify-center gap-3">
      <ActivityIndicator size={size} color={palette.primary}/>
      {message && (<Text className="text-muted text-sm">{message}</Text>)}
    </View>);
    if (fullScreen) {
        return (<View className="flex-1 items-center justify-center bg-background">
        {content}
      </View>);
    }
    return content;
};
