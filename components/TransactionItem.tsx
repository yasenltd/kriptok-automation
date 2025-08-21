import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ArrowDownIcon, ArrowUpIcon, ClipboardIcon } from 'react-native-heroicons/outline';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../theme/typography';
import { copyToClipboard } from '../utils';
import { Icon } from '../utils/types';
import IconButton from './ui/IconButton';
import IconOrImage from './ui/IconOrImage';
import Link from './ui/Link';

type XOR<T, U> = T | U extends object
  ?
      | (T & Partial<Record<Exclude<keyof U, keyof T>, never>>)
      | (U & Partial<Record<Exclude<keyof T, keyof U>, never>>)
  : T | U;

interface TokenWithIconProps {
  icon: Icon | string;
  direction: 'incoming' | 'outgoing';
}

const TokenWithIcon = ({ icon, direction }: TokenWithIconProps) => {
  return (
    <View style={tokenWithIconStyles.container}>
      <IconOrImage icon={icon} size={40} />
      <View style={tokenWithIconStyles.directionIcon}>
        <IconButton
          disabled
          variant="tertiary"
          size="XS"
          icon={direction === 'incoming' ? <ArrowDownIcon /> : <ArrowUpIcon />}
        ></IconButton>
      </View>
    </View>
  );
};

const tokenWithIconStyles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
  },
  directionIcon: {
    position: 'absolute',
    right: -5,
    bottom: 0,
    width: 16,
    height: 16,
  },
});

type TransactionItemProps = { value: number; symbol: string; icon?: Icon | string } & XOR<
  { from: string },
  { to: string }
>;

const TransactionItem = ({ value, symbol, icon, from, to }: TransactionItemProps) => {
  const direction = from ? 'incoming' : 'outgoing';
  const otherSide = direction === 'incoming' ? from : to;

  const { iconStyle, styles } = useTransactionItemStyles();

  return (
    <View style={styles.container}>
      <View style={styles.transactionInfo}>
        {icon && <TokenWithIcon icon={icon} direction={direction} />}
        <View style={styles.transactionInfoDetails}>
          <Text style={styles.directionLabel}>
            {direction === 'incoming' ? 'Received' : 'Sent'}
          </Text>
          <View style={styles.addressDetails}>
            <Text style={styles.addressLabel}>
              {direction === 'incoming' ? 'From' : 'To'}: {otherSide}
            </Text>
            <Link
              icon={<ClipboardIcon></ClipboardIcon>}
              variant="secondary"
              size="S"
              showLeftIcon
              onPress={() => {
                copyToClipboard(otherSide!);
              }}
            />
          </View>
        </View>
      </View>
      <Text
        style={direction === 'incoming' ? styles.valueLabelIncoming : styles.valueLabelOutgoing}
      >
        {direction === 'incoming' ? '+' : '-'}
        {value} {symbol}
      </Text>
    </View>
  );
};

const useTransactionItemStyles = () => {
  const { theme } = useTheme();

  const iconStyle = {
    size: 40,
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignContent: 'center',
      padding: 12,
      gap: 12,
    },
    transactionInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    transactionInfoDetails: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    addressDetails: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 4,
    },

    directionLabel: {
      ...typography.transactionItem.directionLabel,
      color: theme.text.primary,
    },
    addressLabel: {
      ...typography.transactionItem.addressLabel,
      color: theme.text.tertiary,
    },
    valueLabelIncoming: {
      ...typography.transactionItem.valueLabel,
      color: theme.text.success,
    },
    valueLabelOutgoing: {
      ...typography.transactionItem.valueLabel,
      color: theme.text.error,
    },
  });

  return { iconStyle, styles };
};

export default TransactionItem;
