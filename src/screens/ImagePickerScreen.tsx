import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/hooks/useToast';
interface SelectedImage {
    uri: string;
    width: number;
    height: number;
    fileSize?: number;
    mimeType?: string;
}
export const ImagePickerScreen: React.FC = () => {
    const toast = useToast();
    const [image, setImage] = useState<SelectedImage | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const pickFromGallery = async () => {
        setIsLoading(true);
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                toast.error('Permissão de galeria negada. Acesse Configurações para liberar.');
                return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });
            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                setImage({
                    uri: asset.uri,
                    width: asset.width,
                    height: asset.height,
                    fileSize: asset.fileSize,
                    mimeType: asset.mimeType ?? undefined,
                });
                toast.success('Imagem selecionada!');
            }
        }
        catch (error) {
            toast.error('Erro ao abrir galeria');
        }
        finally {
            setIsLoading(false);
        }
    };
    const pickFromCamera = async () => {
        setIsLoading(true);
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                toast.error('Permissão de câmera negada.');
                return;
            }
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });
            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                setImage({
                    uri: asset.uri,
                    width: asset.width,
                    height: asset.height,
                    fileSize: asset.fileSize,
                    mimeType: asset.mimeType ?? undefined,
                });
                toast.success('Foto tirada!');
            }
        }
        catch (error) {
            toast.error('Erro ao abrir câmera');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20, gap: 20 }}>
      <Card>
        <Text className="text-xl font-semibold text-foreground mb-4">
          Pré-visualização
        </Text>

        {image ? (<View className="gap-3">
            <Image source={{ uri: image.uri }} className="w-full rounded-xl" style={{ height: 200, resizeMode: 'cover' }}/>
            <View className="gap-2">
              <View className="flex-row gap-2 flex-wrap">
                <Badge label={`${image.width}x${image.height}px`} variant="info"/>
                {image.mimeType && (<Badge label={image.mimeType} variant="default"/>)}
                {image.fileSize && (<Badge label={`${(image.fileSize / 1024).toFixed(0)} KB`} variant="default"/>)}
              </View>
              <Text className="text-xs text-muted" numberOfLines={2}>
                URI: {image.uri}
              </Text>
            </View>
          </View>) : (<View className="h-40 border border-dashed border-border rounded-lg items-center justify-center">
            <Text className="text-base text-muted">
              Nenhuma imagem selecionada
            </Text>
          </View>)}
      </Card>

      
      <Card>
        <Text className="text-xl font-semibold text-foreground mb-4">
          Origem da imagem
        </Text>
        <View className="gap-3">
          <Button title="Abrir galeria" onPress={pickFromGallery} loading={isLoading} variant="primary"/>
          <Button title="Abrir câmera" onPress={pickFromCamera} loading={isLoading} variant="outline"/>
          {image && (<Button title="Remover imagem" onPress={() => setImage(null)} variant="outline"/>)}
        </View>
      </Card>

      <Card>
        <Text className="text-lg font-semibold text-foreground mb-2">
          Envio para o servidor
        </Text>
        <Text className="text-base text-muted leading-6">
          {`Em produção, use a URI local para enviar ao servidor:\n\nconst formData = new FormData();\nformData.append('photo', {\n  uri: image.uri,\n  type: 'image/jpeg',\n  name: 'photo.jpg',\n});\nawait axios.post('/upload', formData);`}
        </Text>
      </Card>
    </ScrollView>);
};
