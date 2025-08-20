import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../theme/typography';
import { formatNumber } from '../utils/numberUtils';
import { Icon } from '../utils/types';
import Badge from './ui/Badge';
import IconOrImage from './ui/IconOrImage';
import Switch from './ui/Switch';
import TrendingDirection from './ui/TrendingDirection';

interface BaseTokenItemProps {
  icon: Icon | string | number;
  leftSide: ReactNode;
  rightSide: ReactNode;
}

const BaseTokenItem = ({
  icon,
  leftSide,
  rightSide,
}: BaseTokenItemProps & { leftSide: ReactNode; rightSide: ReactNode }) => {
  const { styles } = useTokenItemStyles();

  return (
    <View style={styles.container}>
      {icon && <IconOrImage icon={icon} size={40} />}

      {leftSide}

      {rightSide}
    </View>
  );
};

const TokenNameAndChain = ({ label, chainName }: { label: string; chainName: string }) => {
  const { styles } = useTokenNameAndChainStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.tokenName}>{label}</Text>
      <Badge size="small" label={chainName} />
    </View>
  );
};

const AssetLeftSide = ({
  label,
  chainName,
  percentageChange,
}: {
  label: string;
  chainName: string;
  percentageChange: number;
}) => {
  const { styles } = useTokenItemStyles();

  return (
    <View style={[styles.leftSide, { gap: 6 }]}>
      <TokenNameAndChain label={label} chainName={chainName} />
      <TrendingDirection percentageChange={percentageChange} />
    </View>
  );
};

const GeneralLeftSide = ({
  label,
  chainName,
  symbol,
}: {
  label: string;
  chainName: string;
  symbol: string;
}) => {
  const { theme, styles } = useTokenItemStyles();

  return (
    <View style={styles.leftSide}>
      <TokenNameAndChain label={label} chainName={chainName} />
      <Text style={[typography.tokenItem.symbol, { color: theme.text.tertiary }]}>{symbol}</Text>
    </View>
  );
};

const AssetRightSide = ({
  ownedAmount: ownedAmount,
  fiatEquivalent,
  symbol,
  fiatSymbol,
}: {
  ownedAmount: number;
  fiatEquivalent: number;
  symbol: string;
  fiatSymbol?: string;
}) => {
  const { styles, theme } = useTokenItemStyles();

  return (
    <View style={styles.rightSide}>
      <Text style={[typography.tokenItem.ownedAmount, { color: theme.text.primary }]}>
        {ownedAmount} {symbol}
      </Text>
      <Text style={[typography.tokenItem.fiatEquivalent, { color: theme.text.tertiary }]}>
        {fiatSymbol} {formatNumber(fiatEquivalent)}
      </Text>
    </View>
  );
};

const GeneralRightSide = ({
  tokenPrice: tokenPrice,
  percentageChange,
  priceCurrencySymbol,
}: {
  tokenPrice: number;
  percentageChange: number;
  priceCurrencySymbol?: string;
}) => {
  const { styles, theme } = useTokenItemStyles();

  return (
    <View style={styles.rightSide}>
      <Text style={[typography.tokenItem.tokenPrice, { color: theme.text.primary }]}>
        {priceCurrencySymbol} {formatNumber(tokenPrice)}
      </Text>
      <TrendingDirection percentageChange={percentageChange} />
    </View>
  );
};

const useTokenNameAndChainStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignContent: 'center',
      gap: 4,
    },
    tokenName: {
      ...typography.transactionItem.directionLabel,
      color: theme.text.primary,
    },
  });

  return { styles };
};

const AssetTokenItem = ({
  label,
  chainName,
  symbol,
  icon,
  percentageChange,
  ownedAmount,
  fiatPriceEquivalent,
  fiatCurrencySymbol: priceCurrencySymbol,
}: {
  label: string;
  chainName: string;
  symbol: string;
  icon: Icon | string | number;
  percentageChange: number;
  ownedAmount: number;
  fiatPriceEquivalent: number;
  fiatCurrencySymbol?: string;
}) => {
  return (
    <BaseTokenItem
      leftSide={
        <AssetLeftSide label={label} chainName={chainName} percentageChange={percentageChange} />
      }
      rightSide={
        <AssetRightSide
          ownedAmount={ownedAmount}
          fiatEquivalent={fiatPriceEquivalent}
          symbol={symbol}
          fiatSymbol={priceCurrencySymbol}
        />
      }
      icon={icon}
    />
  );
};

const GeneralTokenItem = ({
  label,
  chainName,
  symbol,
  icon,
  tokenPrice,
  priceCurrencySymbol,
  percentageChange,
}: {
  label: string;
  chainName: string;
  symbol: string;
  icon: Icon | string | number;
  tokenPrice: number;
  priceCurrencySymbol: string;
  percentageChange: number;
}) => {
  return (
    <BaseTokenItem
      leftSide={<GeneralLeftSide label={label} chainName={chainName} symbol={symbol} />}
      rightSide={
        <GeneralRightSide
          tokenPrice={tokenPrice}
          percentageChange={percentageChange}
          priceCurrencySymbol={priceCurrencySymbol}
        />
      }
      icon={icon}
    />
  );
};

const AddTokenItem = ({
  label,
  chainName,
  symbol,
  icon,
  on,
  onToggleToken,
}: {
  label: string;
  chainName: string;
  symbol: string;
  icon: Icon | string | number;
  on: boolean;
  onToggleToken: () => void;
}) => {
  return (
    <BaseTokenItem
      leftSide={<GeneralLeftSide label={label} chainName={chainName} symbol={symbol} />}
      rightSide={<Switch value={on} onValueChange={onToggleToken} />}
      icon={icon}
    />
  );
};

const useTokenItemStyles = () => {
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
      padding: 8,
      gap: 8,
      height: 60,
      overflow: 'hidden',
    },
    leftSide: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    rightSide: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 4,
    },
  });

  return { iconStyle, styles, theme };
};

export { AddTokenItem, AssetTokenItem, GeneralTokenItem };
