import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import AppModal from './ui/AppModal';

type UnlockModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  pin: string;
  setPin: (val: string) => void;
  handleUnlock: () => void;
  text?: string;
};

const UnlockModal: React.FC<UnlockModalProps> = ({
  modalVisible,
  setModalVisible,
  pin,
  setPin,
  handleUnlock,
  text,
}) => {
  return (
    <AppModal
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      title="Enter Your 6-Digit PIN"
      width="medium"
      canClose={false}
    >
      <Text style={{ marginBottom: 10 }}>{text ?? 'Enter your PIN to unlock your wallet.'}</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        maxLength={6}
        secureTextEntry
        value={pin}
        onChangeText={setPin}
        placeholder="Enter PIN"
      />
      <Pressable style={styles.button} onPress={handleUnlock}>
        <Text style={styles.buttonText}>Unlock app</Text>
      </Pressable>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#4f46e5',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    minHeight: 60,
    textAlignVertical: 'top',
  },
});

export default UnlockModal;
