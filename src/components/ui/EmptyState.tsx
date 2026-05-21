import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getThemeColors } from '@/theme/colors';
import { Button } from './Button';
interface EmptyStateProps {
    icon?: React.ComponentProps<typeof Ionicons>['name'];
    title: string;
    subtitle?: string;
    action?: {
        label: string;
        onPress: () => void;
    };
}
export const EmptyState: React.FC<EmptyStateProps> = ({ icon = 'document-outline', title, subtitle, action, }) => {
    const colorScheme = useColorScheme();
    const palette = getThemeColors(colorScheme);
    return (<View className="flex-1 items-center justify-center p-8 gap-4">
      <View className="w-20 h-20 rounded-full bg-secondary items-center justify-center">
        <Ionicons name={icon} size={36} color={palette.text.secondary}/>
      </View>

      <View className="items-center gap-1">
        <Text className="text-lg font-semibold text-foreground text-center">
          {title}
        </Text>
        {subtitle && (<Text className="text-sm text-muted text-center">{subtitle}</Text>)}
      </View>

      {action && (<Button title={action.label} onPress={action.onPress} variant="outline"/>)}
    </View>);
};
