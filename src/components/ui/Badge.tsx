import React from 'react';
import { View, Text } from 'react-native';
type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'default';
interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
}
const variantClasses: Record<BadgeVariant, {
    bg: string;
    text: string;
}> = {
    success: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
    error: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
    warning: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
    info: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    default: { bg: 'bg-secondary', text: 'text-secondary-foreground' },
};
export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default' }) => {
    const { bg, text } = variantClasses[variant];
    return (<View className={`self-start px-2 py-0.5 rounded-full ${bg}`}>
      <Text className={`text-sm font-medium ${text}`}>{label}</Text>
    </View>);
};
