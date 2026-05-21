import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
interface SkeletonProps {
    width?: number | `${number}%`;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}
export const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height = 16, borderRadius = 8, style, }) => {
    const colorScheme = useColorScheme();
    const opacity = useRef(new Animated.Value(0.3)).current;
    useEffect(() => {
        const animation = Animated.loop(Animated.sequence([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0.3,
                duration: 800,
                useNativeDriver: true,
            }),
        ]));
        animation.start();
        return () => animation.stop();
    }, [opacity]);
    return (<Animated.View style={[
            {
                width,
                height,
                borderRadius,
                backgroundColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
                opacity,
            },
            style,
        ]}/>);
};
export const PostSkeleton: React.FC = () => (<View className="p-4 bg-card rounded-xl border border-border/60 gap-3">
    <Skeleton height={12} width="60%"/>
    <Skeleton height={10}/>
    <Skeleton height={10} width="80%"/>
    <Skeleton height={10} width="40%"/>
  </View>);
