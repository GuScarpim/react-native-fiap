import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { fetchPosts } from '../services/posts.service';
import { Post } from '../types/post.types';
import { PostSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getThemeColors } from '@/theme/colors';
import type { AppNavigationProp } from '@/navigation/types';
const POSTS_PER_PAGE = 10;
export const PostsScreen: React.FC = () => {
    const navigation = useNavigation<AppNavigationProp>();
    const colorScheme = useColorScheme();
    const palette = getThemeColors(colorScheme);
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError, error, refetch, isRefetching, } = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: ({ pageParam }) => fetchPosts(pageParam as number, POSTS_PER_PAGE),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
    });
    const posts = data?.pages.flatMap((page) => page.data) ?? [];
    const handleEndReached = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
    const renderItem = useCallback(({ item }: {
        item: Post;
    }) => (<TouchableOpacity className="bg-card border border-border/60 rounded-xl p-4 gap-2 active:opacity-70" onPress={() => navigation.navigate('PostDetail', {
            postId: item.id,
            title: item.title.slice(0, 30) + '...',
        })}>
        <View className="flex-row items-start justify-between gap-2">
          <Text className="flex-1 text-lg font-semibold text-foreground" numberOfLines={2}>
            {item.title}
          </Text>
          <Badge label={`#${item.id}`} variant="info"/>
        </View>
        <Text className="text-base text-muted leading-6" numberOfLines={3}>
          {item.body}
        </Text>
      </TouchableOpacity>), [navigation]);
    if (isPending) {
        return (<View className="flex-1 bg-background p-4 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (<PostSkeleton key={i}/>))}
      </View>);
    }
    if (isError) {
        return (<EmptyState icon="cloud-offline-outline" title="Erro ao carregar posts" subtitle={error?.message ?? 'Verifique sua conexão'} action={{ label: 'Tentar novamente', onPress: refetch }}/>);
    }
    return (<View className="flex-1 bg-background">
      
      <View className="px-5 pt-6 pb-4">
        <Text className="text-2xl font-bold text-foreground">
          Posts
        </Text>
        <Text className="text-base text-muted mt-2">
          {posts.length} de 100 itens carregados. Puxe para atualizar ou role até o fim para carregar mais.
        </Text>
      </View>

      <FlatList data={posts} keyExtractor={(item) => String(item.id)} renderItem={renderItem} contentContainerStyle={{ padding: 16, gap: 12 }} refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={palette.primary}/>} onEndReached={handleEndReached} onEndReachedThreshold={0.2} ListFooterComponent={isFetchingNextPage ? (<View className="py-6 items-center">
              <ActivityIndicator color={palette.primary}/>
              <Text className="text-base text-muted mt-2">
                Carregando mais posts...
              </Text>
            </View>) : !hasNextPage && posts.length > 0 ? (<View className="py-6 items-center">
              <Text className="text-base text-muted">
                Todos os posts foram carregados.
              </Text>
            </View>) : null} ListEmptyComponent={<EmptyState icon="newspaper-outline" title="Nenhum post encontrado" subtitle="Puxe para atualizar" action={{ label: 'Atualizar', onPress: refetch }}/>}/>
    </View>);
};
