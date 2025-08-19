import { useTheme } from '@/context/ThemeContext';
import { Header, HeaderBackButton } from '@react-navigation/elements';
import { Stack, usePathname } from 'expo-router';
import { useMemo } from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

const ThemedStack = () => {
  const { theme, colorScheme } = useTheme();
  const pathname = usePathname();
  const { t } = useTranslation();

  const showHeader = useMemo(() => {
    const headerRoutes = ['/', '/generate', '/import'];
    return headerRoutes.includes(pathname);
  }, [pathname]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface.primary }}>
      <ExpoStatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: theme.surface.primary },

          headerShown: showHeader,

          header: props => (
            <Header
              {...props}
              title={props.options.title as string}
              headerTitleAlign="center"
              headerBackButtonDisplayMode="minimal"
              headerTransparent={true}
              headerTitleStyle={{ color: theme.text.primary }}
              headerStyle={{ borderBottomWidth: 0, shadowOpacity: 0, elevation: 0 }}
              headerLeft={headerProps =>
                typeof props.options.headerLeft === 'function' ? (
                  props.options.headerLeft(headerProps)
                ) : props.back && pathname !== '/home' ? (
                  <HeaderBackButton
                    {...headerProps}
                    onPress={props.navigation.goBack}
                    label=""
                    tintColor={theme.text.primary}
                  />
                ) : null
              }
            />
          ),
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="generate" options={{ headerShown: true, title: t('createTitle') }} />
        <Stack.Screen name="import" options={{ headerShown: true }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
};

export default ThemedStack;
