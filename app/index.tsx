import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import AuthGuard from '@/screens/AuthGuard';
import Safe from '@/assets/images/safe.svg';
import { useTheme } from '@/context/ThemeContext';
import { typography } from '@/theme/typography';
import ConcentricCircles from '@components/ConcentricCircles';
import MaskedView from '@react-native-masked-view/masked-view';
import Button from '@components/ui/Button';
import { colors } from '@/theme/colors';

const SIZE = 400;
const FADE = 0.6;

const WelcomeScreen = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <AuthGuard>
      <LinearGradient
        colors={['#A3BDED', '#050505']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={[styles.container, { position: 'relative' }]}>
          <View
            style={[
              StyleSheet.absoluteFillObject,
              { alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 2 },
            ]}
          >
            <MaskedView
              style={{ width: SIZE, height: SIZE }}
              maskElement={
                <LinearGradient
                  colors={['#fff', '#fff', 'transparent']}
                  locations={[0, FADE, 1]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 0.5 }}
                  style={{ width: SIZE, height: SIZE }}
                />
              }
            >
              <View
                style={{
                  width: SIZE,
                  height: SIZE,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ConcentricCircles size={SIZE} color="#31353C" ringGap={20} />
              </View>

              <Image
                source={require('@assets/logos/btc-circle.png')}
                style={{
                  position: 'absolute',
                  width: 84,
                  height: 84,
                  bottom: '60%',
                  right: '5%',
                  resizeMode: 'contain',
                }}
              />
              <Image
                source={require('@assets/logos/eth-circle.png')}
                style={{
                  position: 'absolute',
                  width: 84,
                  height: 84,
                  top: '10%',
                  left: '20%',
                  resizeMode: 'contain',
                }}
              />

              <Image
                source={require('@assets/logos/sol-circle.png')}
                style={{
                  position: 'absolute',
                  width: 84,
                  height: 84,
                  top: '0%',
                  left: '50%',
                  resizeMode: 'contain',
                }}
              />

              <Image
                source={require('@assets/logos/sui-circle.png')}
                style={{
                  position: 'absolute',
                  width: 84,
                  height: 84,
                  top: '25%',
                  left: '0%',
                  resizeMode: 'contain',
                }}
              />
            </MaskedView>
          </View>

          <View
            style={[
              StyleSheet.absoluteFillObject,
              {
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                zIndex: 10,
                elevation: 10,
                marginBottom: 60,
              },
            ]}
          >
            <Safe width={80} height={80} />
          </View>

          <View style={{ flex: 1 }}></View>

          <View
            style={[
              {
                flex: 1,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
                zIndex: 99,
                elevation: 99,
              },
            ]}
          >
            <View>
              <Text style={[typography['heading3'], { color: theme.text.primary }]}>
                {t('kriptokWallet')}
              </Text>
              <View>
                <Text style={[styles.subtitle, styles.text, { color: theme.text.tertiary }]}>
                  {t('getStarted')}
                </Text>
                <Text style={[styles.subtitle, styles.text, { color: theme.text.tertiary }]}>
                  {t('orImport')}
                </Text>
              </View>
            </View>

            <View style={{ gap: 12, width: '100%' }}>
              <Button
                label="Create new wallet"
                onPress={() => router.push('/generate')}
                state="default"
                style="accent"
                size="screen"
              />
              <Button
                label="Import an existing wallet"
                state="default"
                style="outline"
                size="screen"
                onPress={() => router.push('/import')}
              />
            </View>

            <View style={{ gap: 2 }}>
              <Text style={[styles.subtitle, styles.text, { color: theme.text.primary }]}>
                By continuing forward you agree with our
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Pressable onPress={() => router.push('/terms')}>
                  <Text style={[styles.subtitle, styles.text, { color: colors.blue[40] }]}>
                    Terms and Conditions
                  </Text>
                </Pressable>

                <Text style={[styles.subtitle, styles.text, { color: theme.text.primary }]}>
                  and
                </Text>

                <Pressable onPress={() => router.push('/privacy')}>
                  <Text style={[styles.subtitle, styles.text, { color: colors.blue[40] }]}>
                    Privacy Policy
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </AuthGuard>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4f46e5',
    padding: 14,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
    width: '80%',
  },
  buttonPressed: {
    backgroundColor: '#4338ca',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  text: {
    fontFamily: 'Satoshi-Regular',
  },
});
