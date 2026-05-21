import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, withSequence, withRepeat, interpolate, Easing, } from 'react-native-reanimated';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
const FadeDemo: React.FC = () => {
    const opacity = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));
    const fadeOut = () => {
        opacity.value = withTiming(0, { duration: 600, easing: Easing.ease });
    };
    const fadeIn = () => {
        opacity.value = withTiming(1, { duration: 600, easing: Easing.ease });
    };
    return (<Card>
      <Text className="text-lg font-semibold text-foreground mb-3">
        Fade com withTiming
      </Text>
      <Animated.View style={animatedStyle} className="h-16 bg-primary rounded-lg mb-3 items-center justify-center">
        <Text className="text-primary-foreground font-bold">Animated Box</Text>
      </Animated.View>
      <View className="flex-row gap-2">
        <Button title="Fade Out" onPress={fadeOut} variant="outline"/>
        <Button title="Fade In" onPress={fadeIn} variant="primary"/>
      </View>
    </Card>);
};
const ScaleDemo: React.FC = () => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));
    const bounce = () => {
        scale.value = withSpring(1.3, { damping: 4, stiffness: 200 }, () => {
            scale.value = withSpring(1);
        });
    };
    const pulse = () => {
        scale.value = withRepeat(withTiming(1.1, { duration: 500 }), 6, true);
    };
    return (<Card>
      <Text className="text-lg font-semibold text-foreground mb-3">
        Escala com withSpring
      </Text>
      <Animated.View style={animatedStyle} className="h-16 w-16 bg-green-600 rounded-full self-center mb-3"/>
      <View className="flex-row gap-2">
        <Button title="Bounce" onPress={bounce} variant="outline"/>
        <Button title="Pulse" onPress={pulse} variant="primary"/>
      </View>
    </Card>);
};
const SlideDemo: React.FC = () => {
    const progress = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: interpolate(progress.value, [0, 1], [0, 150]),
            },
        ],
        opacity: interpolate(progress.value, [0, 1], [1, 0.3]),
    }));
    const slideRight = () => {
        progress.value = withTiming(1, { duration: 500 });
    };
    const reset = () => {
        progress.value = withSpring(0);
    };
    return (<Card>
      <Text className="text-lg font-semibold text-foreground mb-3">
        Deslocamento com interpolate
      </Text>
      <View className="overflow-hidden mb-3">
        <Animated.View style={animatedStyle} className="h-12 w-12 bg-blue-500 rounded-lg items-center justify-center">
          <View className="w-4 h-4 bg-white rounded-sm"/>
        </Animated.View>
      </View>
      <View className="flex-row gap-2">
        <Button title="Slide" onPress={slideRight} variant="outline"/>
        <Button title="Reset" onPress={reset} variant="primary"/>
      </View>
    </Card>);
};
const SequenceDemo: React.FC = () => {
    const translateY = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));
    const runSequence = () => {
        translateY.value = withSequence(withTiming(-30, { duration: 200 }), withSpring(0, { damping: 3 }));
    };
    return (<Card>
      <Text className="text-lg font-semibold text-foreground mb-3">
        Sequência encadeada
      </Text>
      <View className="items-center mb-3 h-16 justify-center">
        <Animated.View style={animatedStyle} className="h-10 w-10 bg-primary rounded-lg"/>
      </View>
      <Button title="Executar sequência" onPress={runSequence} variant="primary"/>
    </Card>);
};
export const AnimationsScreen: React.FC = () => {
    return (<ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20, gap: 20 }}>
      <Text className="text-base text-muted leading-6">
        Exemplos com Reanimated executando na thread de interface, fora do bridge JavaScript.
      </Text>

      <FadeDemo />
      <ScaleDemo />
      <SlideDemo />
      <SequenceDemo />
    </ScrollView>);
};
