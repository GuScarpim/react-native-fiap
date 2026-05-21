import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
type AvatarSize = 'sm' | 'md' | 'lg';
interface AvatarProps {
    uri?: string | null;
    name?: string;
    size?: AvatarSize;
}
const sizes: Record<AvatarSize, {
    container: number;
    text: string;
}> = {
    sm: { container: 32, text: 'text-xs' },
    md: { container: 44, text: 'text-sm' },
    lg: { container: 64, text: 'text-xl' },
};
function getInitials(name?: string): string {
    if (!name)
        return '?';
    return name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();
}
export const Avatar: React.FC<AvatarProps> = ({ uri, name, size = 'md', }) => {
    const [imageError, setImageError] = useState(false);
    const { container, text } = sizes[size];
    const showImage = uri && !imageError;
    return (<View className="rounded-full bg-primary items-center justify-center overflow-hidden" style={{ width: container, height: container }}>
      {showImage ? (<Image source={{ uri }} style={{ width: container, height: container }} onError={() => setImageError(true)}/>) : (<Text className={`${text} font-bold text-primary-foreground`}>
          {getInitials(name)}
        </Text>)}
    </View>);
};
