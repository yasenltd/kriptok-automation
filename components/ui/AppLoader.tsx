import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { colors } from '@/utils';

const AppLoader: React.FC = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors['primary-white'],
      }}
    >
      <ActivityIndicator size="large" color={colors['primary-blue']} />
    </View>
  );
};

export default AppLoader;
