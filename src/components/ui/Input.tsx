import React, { forwardRef } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getThemeColors } from '@/theme/colors';
interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ComponentProps<typeof Ionicons>['name'];
    rightIcon?: React.ComponentProps<typeof Ionicons>['name'];
    onRightIconPress?: () => void;
}
export const Input = forwardRef<TextInput, InputProps>(({ label, error, leftIcon, rightIcon, onRightIconPress, ...props }, ref) => {
    const colorScheme = useColorScheme();
    const palette = getThemeColors(colorScheme);
    const hasError = !!error;
    return (<View className="gap-1">
        
        {label && (<Text className="text-base font-medium text-foreground">{label}</Text>)}

        
        <View className={`flex-row items-center rounded-lg border px-3 bg-card ${hasError ? 'border-red-500' : 'border-border'}`}>
          
          {leftIcon && (<Ionicons name={leftIcon} size={18} color={palette.text.secondary} style={{ marginRight: 8 }}/>)}

          
          <TextInput ref={ref} className="flex-1 py-4 text-foreground text-lg" placeholderTextColor={palette.text.secondary} {...props}/>

          
          {rightIcon && (<TouchableOpacity onPress={onRightIconPress} hitSlop={8}>
              <Ionicons name={rightIcon} size={18} color={palette.text.secondary}/>
            </TouchableOpacity>)}
        </View>

        
        {hasError && (<Text className="text-sm text-red-500">{error}</Text>)}
      </View>);
});
Input.displayName = 'Input';
