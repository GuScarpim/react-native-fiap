import React, { useRef } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../validators/login.schema';
import { login } from '@/services/auth.service';
import { useAuthStore } from '@/store';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
export const LoginScreen: React.FC = () => {
    const { setAuth, setLoading, isLoading } = useAuthStore();
    const toast = useToast();
    const passwordRef = useRef<TextInput>(null);
    const { control, handleSubmit, formState: { errors }, } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: 'admin@demo.com',
            password: '123456',
        },
    });
    const onSubmit = async (data: LoginFormData) => {
        try {
            setLoading(true);
            const { user } = await login(data);
            setAuth(user);
            toast.success(`Bem-vindo, ${user.name}!`);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erro ao fazer login';
            toast.error(message);
        }
        finally {
            setLoading(false);
        }
    };
    return (<KeyboardAvoidingView className="flex-1 bg-background" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center p-6 gap-8">
          
          <View className="gap-3 mb-2">
            <Text className="text-3xl font-bold text-foreground">
              Entrar
            </Text>
            <Text className="text-lg text-muted leading-7">
              Use as credenciais de demonstração abaixo para acessar o app.
            </Text>
          </View>

          
          <View className="gap-4">
            
            <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => (<Input label="E-mail" placeholder="seu@email.com" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.email?.message} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} returnKeyType="next" onSubmitEditing={() => passwordRef.current?.focus()}/>)}/>

            <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => (<Input ref={passwordRef} label="Senha" placeholder="••••••" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.password?.message} secureTextEntry returnKeyType="done" onSubmitEditing={handleSubmit(onSubmit)}/>)}/>

            <Button title="Entrar" onPress={handleSubmit(onSubmit)} loading={isLoading} variant="primary"/>
          </View>

          
          <View className="border border-border rounded-lg p-5 gap-2">
            <Text className="text-base font-medium text-foreground">
              Credenciais de demonstração
            </Text>
            <Text className="text-base text-muted leading-6">
              admin@demo.com — senha 123456
            </Text>
            <Text className="text-base text-muted leading-6">
              user@demo.com — senha 123456
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>);
};
