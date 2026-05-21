import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRoute, RouteProp } from '@react-navigation/native';
import { fetchPostById } from '../services/posts.service';
import { Loader } from '@/components/ui/Loader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import type { AppStackParamList } from '@/navigation/types';
type PostDetailRoute = RouteProp<AppStackParamList, 'PostDetail'>;
export const PostDetailScreen: React.FC = () => {
    const { params } = useRoute<PostDetailRoute>();
    const { data: post, isPending, isError } = useQuery({
        queryKey: ['post', params.postId],
        queryFn: () => fetchPostById(params.postId),
    });
    if (isPending)
        return <Loader fullScreen message="Carregando post..."/>;
    if (isError || !post) {
        return (<EmptyState icon="alert-circle-outline" title="Post não encontrado" subtitle="Tente novamente"/>);
    }
    return (<ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16, gap: 16 }}>
      <View className="flex-row gap-2">
        <Badge label={`Post #${post.id}`} variant="info"/>
        <Badge label={`Usuário ${post.userId}`} variant="default"/>
      </View>

      <Card>
        <Text className="text-xl font-bold text-foreground mb-3">
          {post.title}
        </Text>
        <Text className="text-base text-muted leading-6">{post.body}</Text>
      </Card>

      <Card>
        <Text className="text-lg font-semibold text-foreground mb-2">
          Cache do TanStack Query
        </Text>
        <Text className="text-base text-muted leading-6">
          Este post foi buscado por ID. Se você já viu esse post na lista,
          o cache do TanStack Query foi usado — sem nova requisição!
        </Text>
      </Card>
    </ScrollView>);
};
