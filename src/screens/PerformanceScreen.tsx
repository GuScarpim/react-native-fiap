import React, { useState, useCallback, useMemo, memo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

let renderCount = 0;
const NormalComponent: React.FC<{ label: string }> = ({ label }) => {
    renderCount++;
    return (
        <View className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <Text className="text-base text-red-700 dark:text-red-400">
                {label} — renderizou {renderCount}x
            </Text>
        </View>
    );
};

let memoRenderCount = 0;
const MemoizedComponent = memo<{ label: string }>(({ label }) => {
    memoRenderCount++;
    return (
        <View className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Text className="text-base text-green-700 dark:text-green-400">
                {label} — renderizou {memoRenderCount}x
            </Text>
        </View>
    );
});
MemoizedComponent.displayName = 'MemoizedComponent';

const MemoDemo: React.FC = () => {
    const [count, setCount] = useState(0);
    return (
        <Card>
            <Text className="text-lg font-semibold text-foreground mb-3">
                React.memo — Evitar Re-renders
            </Text>
            <View className="gap-2 mb-3">
                <NormalComponent label="Sem memo" />
                <MemoizedComponent label="Com memo" />
            </View>
            <Text className="text-base text-muted mb-3">
                Counter: {count} — Clique para forçar re-render do pai
            </Text>
            <Button
                title={`Re-render pai (${count})`}
                onPress={() => setCount((c) => c + 1)}
                variant="outline"
            />
        </Card>
    );
};

const UseCallbackDemo: React.FC = () => {
    const [multiplier, setMultiplier] = useState(2);
    const expensiveResult = useMemo(() => {
        const items = [1, 2, 3, 4, 5];
        return items.reduce((sum, n) => sum + n * multiplier, 0);
    }, [multiplier]);
    return (
        <Card>
            <Text className="text-lg font-semibold text-foreground mb-2">
                useCallback & useMemo
            </Text>
            <Text className="text-base text-muted mb-4">
                useMemo result: {expensiveResult} (multiplier: {multiplier})
            </Text>
            <View className="flex-row gap-2">
                <Button
                    title={`x${multiplier} → x${multiplier + 1}`}
                    onPress={() => setMultiplier((m) => m + 1)}
                    variant="outline"
                />
                <Button title="Reset" onPress={() => setMultiplier(2)} variant="primary" />
            </View>
        </Card>
    );
};

const ITEMS = Array.from({ length: 500 }, (_, i) => ({
    id: String(i),
    label: `Item ${i + 1}`,
    value: Math.floor(Math.random() * 1000),
}));

type ListItem = (typeof ITEMS)[0];

const ListItemComponent = memo<{ item: ListItem }>(({ item }) => (
    <View className="px-4 py-3 border-b border-border/40 flex-row justify-between">
        <Text className="text-base text-foreground">{item.label}</Text>
        <Text className="text-base text-muted">{item.value}</Text>
    </View>
));
ListItemComponent.displayName = 'ListItemComponent';

const ListHeader: React.FC<{
    useFlash: boolean;
    onSelectFlatList: () => void;
    onSelectFlashList: () => void;
}> = ({ useFlash, onSelectFlatList, onSelectFlashList }) => (
    <View className="p-4 gap-4">
        <View className="bg-card border border-border/60 rounded-xl p-4">
            <Text className="text-lg font-semibold text-foreground">
                Performance React Native
            </Text>
            <Text className="text-base text-muted mt-1">
                Profiling com: Flipper • React DevTools • Hermes Profiler
            </Text>
        </View>
        <MemoDemo />
        <UseCallbackDemo />
        <Card>
            <Text className="text-lg font-semibold text-foreground mb-2">
                FlatList vs FlashList (500 itens)
            </Text>
            <Text className="text-base text-muted mb-4">
                A lista abaixo parece igual nos dois modos. Isso é esperado: o layout é o mesmo. O que
                muda é como o React Native monta e recicla as linhas por trás.
            </Text>
            <View className="flex-row gap-2 mb-4">
                <View className="flex-1">
                    <Button
                        title="FlatList"
                        onPress={onSelectFlatList}
                        variant={useFlash ? 'outline' : 'primary'}
                    />
                </View>
                <View className="flex-1">
                    <Button
                        title="FlashList"
                        onPress={onSelectFlashList}
                        variant={useFlash ? 'primary' : 'outline'}
                    />
                </View>
            </View>
            <View className="gap-3">
                <View className={`p-3 rounded-lg border ${useFlash ? 'border-border bg-secondary/40' : 'border-primary bg-primary/10'}`}>
                    <Text className="text-base font-semibold text-foreground mb-1">FlatList</Text>
                    <Text className="text-base text-muted leading-6">
                        Componente nativo do React Native. Bom para listas pequenas e médias. Em listas
                        muito grandes, o scroll pode ficar mais pesado.
                    </Text>
                </View>
                <View className={`p-3 rounded-lg border ${useFlash ? 'border-primary bg-primary/10' : 'border-border bg-secondary/40'}`}>
                    <Text className="text-base font-semibold text-foreground mb-1">FlashList</Text>
                    <Text className="text-base text-muted leading-6">
                        Biblioteca da Shopify com a mesma API visual. Recicla células de forma mais
                        agressiva e costuma manter o scroll mais fluido com milhares de itens.
                    </Text>
                </View>
            </View>
        </Card>
    </View>
);

export const PerformanceScreen: React.FC = () => {
    const [useFlash, setUseFlash] = useState(false);
    const keyExtractor = useCallback((item: ListItem) => item.id, []);
    const renderItem = useCallback(
        ({ item }: { item: ListItem }) => <ListItemComponent item={item} />,
        [],
    );
    const listHeader = useMemo(
        () => (
            <ListHeader
                useFlash={useFlash}
                onSelectFlatList={() => setUseFlash(false)}
                onSelectFlashList={() => setUseFlash(true)}
            />
        ),
        [useFlash],
    );

    if (useFlash) {
        return (
            <View className="flex-1 bg-background">
                <FlashList
                    key="flash-list"
                    data={ITEMS}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    ListHeaderComponent={listHeader}
                />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            <FlatList
                key="flat-list"
                data={ITEMS}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                ListHeaderComponent={listHeader}
                removeClippedSubviews
                maxToRenderPerBatch={10}
                windowSize={5}
            />
        </View>
    );
};
