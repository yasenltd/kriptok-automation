import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  Text,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { Icon } from 'react-native-paper';
import { colors } from '@/utils';

interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  scrollable?: boolean;
  width?: 'screen' | 'large' | 'medium' | 'small' | 'xLarge' | 'auto';
  canClose?: boolean;
  minWidth?: boolean;
}

const widthMapping = {
  screen: '100%' as `${number}%`,
  xLarge: 700,
  large: 550,
  medium: 350,
  small: 200,
  auto: undefined,
};

const AppModal: React.FC<AppModalProps> = ({
  visible,
  onClose,
  children,
  title,
  scrollable = false,
  width = 'screen',
  canClose = true,
  minWidth,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={() => {
        if (canClose) onClose();
      }}
    >
      <View style={styles.overlay}>
        <View style={[styles.centeredWrapper]}>
          <View style={[styles.modalContainer, { width: widthMapping[width] }]}>
            {canClose && (
              <Pressable style={styles.closeIcon} onPress={onClose}>
                <Icon source="close" size={18} color={colors['text-black']} />
              </Pressable>
            )}
            <View style={styles.modalContent}>
              <View style={styles.header}>
                {title && <Text style={styles.title}>{title}</Text>}
              </View>

              {scrollable ? (
                <ScrollView
                  contentContainerStyle={styles.content}
                  keyboardShouldPersistTaps="handled"
                >
                  {children}
                </ScrollView>
              ) : (
                <View style={styles.content}>{children}</View>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AppModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 40,
  },
  centeredWrapper: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    backgroundColor: colors['primary-white'],
    borderRadius: 16,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  modalContent: {
    maxHeight: Dimensions.get('window').height * (Platform.OS !== 'web' ? 0.6 : 0.7),
  },
  header: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors['text-black'],
    width: '100%',
    textAlign: 'center',
    fontFamily: 'montserrat-regular',
  },
  content: {
    width: '100%',
  },
  closeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
});
