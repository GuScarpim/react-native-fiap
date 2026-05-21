import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
export type AuthStackParamList = {
    Login: undefined;
};
export type TabParamList = {
    Showcase: undefined;
    Posts: undefined;
    Settings: undefined;
};
export type AppStackParamList = {
    MainTabs: NavigatorScreenParams<TabParamList>;
    Animations: undefined;
    ImagePicker: undefined;
    Biometric: undefined;
    OTA: undefined;
    Notifications: undefined;
    Performance: undefined;
    I18n: undefined;
    Offline: undefined;
    PostDetail: {
        postId: number;
        title: string;
    };
};
export type TabScreenNavigationProp = CompositeNavigationProp<BottomTabNavigationProp<TabParamList>, NativeStackNavigationProp<AppStackParamList>>;
export type AppNavigationProp = NativeStackNavigationProp<AppStackParamList>;
