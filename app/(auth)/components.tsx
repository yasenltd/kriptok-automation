import { AddTokenItem, AssetTokenItem, GeneralTokenItem } from '@/components/TokenItem';
import TransactionItem from '@/components/TransactionItem';
import TrendingTokenChip from '@/components/TrendingTokenChip';
import ActionButton from '@/components/ui/ActionButton';
import Checkbox from '@/components/ui/AppCheckbox';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import FocusNote from '@/components/ui/FocusNote';
import IconButton from '@/components/ui/IconButton';
import Input from '@/components/ui/Input';
import Link from '@/components/ui/Link';
import Switch from '@/components/ui/Switch';
import Toggle from '@/components/ui/Toggle';
import TrendingDirection from '@/components/ui/TrendingDirection';
import WalletItem from '@/components/WalletItem';
import { useTheme } from '@/context/ThemeContext';
import { useMemo, useRef, useState } from 'react';
import { Image, ScrollView, Text, TextInput, View } from 'react-native';
import { ArrowUpIcon, ExclamationCircleIcon, PlusIcon } from 'react-native-heroicons/micro';
import { ClipboardIcon } from 'react-native-heroicons/outline';
import AppPinInput from '../../components/ui/AppPinInput';
import TextArea from '../../components/ui/TextArea';
import WalletBadge from '../../components/WalletBadge';

const Components: React.FC = () => {
  const { theme, colorScheme, toggleTheme } = useTheme();

  const [checkboxValue, setCheckboxValue] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [pinError, setPinError] = useState<string | undefined>(undefined);
  const myPinValue = useMemo(() => '123456', []);
  const pinInputRef = useRef<TextInput>(null);

  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState<string | undefined>(undefined);
  const inputRef = useRef<TextInput>(null);

  const [swapInputValue, setSwapInputValue] = useState('');
  const [swapInputError, setSwapInputError] = useState<string | undefined>(undefined);

  const balance = 10;
  const [tokenOn, setTokenOn] = useState(false);

  const tokenData = [
    {
      label: 'Bitcoin',
      value: 'btc',
      icon: () => (
        <Image
          source={require('assets/usdc.png')}
          style={{ width: 24, height: 24, borderRadius: 12 }}
        />
      ),
    },
    {
      label: 'USDC',
      value: 'eth',
      icon: () => (
        <Image
          source={require('assets/usdc.png')}
          style={{ width: 24, height: 24, borderRadius: 12 }}
        />
      ),
    },
    {
      label: 'Solana',
      value: 'sol',
      icon: () => (
        <Image
          source={require('assets/usdc.png')}
          style={{ width: 24, height: 24, borderRadius: 12 }}
        />
      ),
    },
    {
      label: 'Bitcoin',
      value: 'btc2',
      icon: () => (
        <Image
          source={require('assets/usdc.png')}
          style={{ width: 24, height: 24, borderRadius: 12 }}
        />
      ),
    },
    {
      label: 'USDC',
      value: 'eth2',
      icon: () => (
        <Image
          source={require('assets/usdc.png')}
          style={{ width: 24, height: 24, borderRadius: 12 }}
        />
      ),
    },
    {
      label: 'Solana',
      value: 'sol2',
      icon: () => (
        <Image
          source={require('assets/usdc.png')}
          style={{ width: 24, height: 24, borderRadius: 12 }}
        />
      ),
    },
  ];
  const [selectorItems, setSelectorItems] = useState(tokenData);
  const [selectorValue, setSelectorValue] = useState<string | null>(null);

  return (
    <>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <Text style={{ color: theme.text.primary }}>Theme: {colorScheme ?? 'undefined'}</Text>
        <Switch
          size="L"
          value={colorScheme === 'dark'}
          onValueChange={() => {
            toggleTheme();
          }}
        />
        <Switch
          size="L"
          value={colorScheme === 'dark'}
          onValueChange={() => {
            toggleTheme();
          }}
          disabled={true}
        />

        <View style={{ alignItems: 'center', marginBottom: 10 }}>
          <Button label="Default" variant="accent" />
          <Button label="Default" loading variant="accent" showLeftIcon={true} />
          <Button label="Default" disabled variant="accent" />

          <Button label="Secondary" variant="secondary" />
          <Button label="Secondary" loading variant="secondary" showLeftIcon={true} />
          <Button label="Secondary" disabled variant="secondary" />

          <Button label="Tertiary" variant="tertiary" />
          <Button label="Tertiary" loading variant="tertiary" showLeftIcon={true} />
          <Button label="Tertiary" disabled variant="tertiary" />

          <Button label="Outline" variant="outline" />
          <Button label="Outline" loading variant="outline" showLeftIcon={true} />
          <Button label="Outline" disabled variant="outline" />

          <Button label="Ghost" variant="ghost" />
          <Button label="Ghost" loading variant="ghost" showLeftIcon={true} />
          <Button label="Ghost" disabled variant="ghost" />

          <View>
            <IconButton variant="accent" icon={<PlusIcon />} />
            <IconButton loading variant="accent" icon={<PlusIcon />} />
            <IconButton disabled variant="accent" icon={<PlusIcon />} />
          </View>

          <View>
            <IconButton variant="secondary" icon={<PlusIcon />} />
            <IconButton loading variant="secondary" icon={<PlusIcon />} />
            <IconButton disabled variant="secondary" icon={<PlusIcon />} />
          </View>

          <View>
            <IconButton variant="tertiary" icon={<PlusIcon />} />
            <IconButton loading variant="tertiary" icon={<PlusIcon />} />
            <IconButton disabled variant="tertiary" icon={<PlusIcon />} />
          </View>

          <View>
            <IconButton variant="outline" icon={<PlusIcon />} />
            <IconButton loading variant="outline" icon={<PlusIcon />} />
            <IconButton disabled variant="outline" icon={<PlusIcon />} />
          </View>

          <View>
            <IconButton variant="ghost" icon={<PlusIcon />} />
            <IconButton loading variant="ghost" icon={<PlusIcon />} />
            <IconButton disabled variant="ghost" icon={<PlusIcon />} />
          </View>

          <View>
            <ActionButton label="Default" icon={<ArrowUpIcon />} />
            <ActionButton label="Loading" loading icon={<ArrowUpIcon />} />
            <ActionButton label="Disabled" disabled icon={<ArrowUpIcon />} />
          </View>

          <View>
            <Toggle
              options={[
                { label: 'Label', key: 'option1', icon: <PlusIcon /> },
                { label: 'Label', key: 'option2', icon: <PlusIcon /> },
                { label: 'Label', key: 'option3', icon: <PlusIcon /> },
              ]}
            ></Toggle>
          </View>

          <Checkbox
            label="Label"
            description="Description"
            value={checkboxValue}
            onChange={newValue => setCheckboxValue(newValue)}
          />

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Link
              label="Accent"
              onPress={() => {}}
              variant="accent"
              size="L"
              icon={<PlusIcon />}
              showLeftIcon={true}
            />
            <Link
              label="Accent"
              onPress={() => {}}
              variant="accent"
              disabled
              size="L"
              icon={<PlusIcon />}
              showLeftIcon={true}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Link
              label="Accent"
              onPress={() => {}}
              variant="accent"
              size="S"
              icon={<PlusIcon />}
              showLeftIcon={true}
            />
            <Link
              label="Accent"
              onPress={() => {}}
              variant="accent"
              disabled
              size="S"
              icon={<PlusIcon />}
              showLeftIcon={true}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Link
              label="Secondary"
              onPress={() => {}}
              variant="secondary"
              size="L"
              icon={<PlusIcon />}
              showLeftIcon={true}
            />
            <Link
              label="Secondary"
              onPress={() => {}}
              variant="secondary"
              disabled
              size="L"
              icon={<PlusIcon />}
              showLeftIcon={true}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Link
              label="Secondary"
              onPress={() => {}}
              variant="secondary"
              size="S"
              icon={<PlusIcon />}
              showLeftIcon={true}
            />
            <Link
              label="Secondary"
              onPress={() => {}}
              variant="secondary"
              disabled
              size="S"
              icon={<PlusIcon />}
              showLeftIcon={true}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Link
              label="Create"
              onPress={() => {}}
              variant="create"
              size="L"
              icon={<PlusIcon />}
              showLeftIcon={true}
            />
            <Link
              label="Create"
              onPress={() => {}}
              variant="create"
              disabled
              size="L"
              icon={<PlusIcon />}
              showLeftIcon={true}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Link
              label="Create"
              onPress={() => {}}
              variant="create"
              size="S"
              icon={<PlusIcon />}
              showLeftIcon={true}
            />
            <Link
              label="Create"
              onPress={() => {}}
              variant="create"
              disabled
              size="S"
              icon={<PlusIcon />}
              showLeftIcon={true}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Link
              label="Destruct"
              onPress={() => {}}
              variant="destruct"
              size="L"
              icon={<PlusIcon />}
              showLeftIcon={true}
            />
            <Link
              label="Destruct"
              onPress={() => {}}
              variant="destruct"
              disabled
              size="L"
              icon={<PlusIcon />}
              showLeftIcon={true}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Link
              label="Destruct"
              onPress={() => {}}
              variant="destruct"
              size="S"
              icon={<PlusIcon />}
              showLeftIcon={true}
            />
            <Link
              label="Destruct"
              onPress={() => {}}
              variant="destruct"
              disabled
              size="S"
              icon={<PlusIcon />}
              showLeftIcon={true}
            />
          </View>
        </View>
        <Input
          ref={inputRef}
          label="Label"
          placeholder="Placeholder"
          hint="Hint text"
          variant="fill"
          error={inputError}
          value={inputValue}
          setValue={inputValue => {
            setInputValue(inputValue);
            if (inputValue.length === myPinValue.length) {
              if (inputValue !== myPinValue) {
                setInputError('Incorrect PIN');
              } else {
                setInputError(undefined);
              }
            } else {
              setInputError(undefined);
            }
          }}
          leftIcon={<PlusIcon />}
          firstRightButton={<Link label="Paste?" onPress={() => {}} />}
          secondRightButton={
            <Link
              variant="secondary"
              icon={<ClipboardIcon />}
              showLeftIcon={true}
              onPress={() => {}}
            />
          }
          style={{ alignSelf: 'stretch' }}
        />
        <Input
          ref={inputRef}
          label="Label"
          placeholder="Disabled Placeholder"
          hint="Hint text"
          variant="fill"
          error={inputError}
          value={inputValue}
          setValue={inputValue => {
            setInputValue(inputValue);
            if (inputValue.length === myPinValue.length) {
              if (inputValue !== myPinValue) {
                setInputError('Incorrect PIN');
              } else {
                setInputError(undefined);
              }
            } else {
              setInputError(undefined);
            }
          }}
          width={'screen'}
          leftIcon={<PlusIcon />}
          firstRightButton={<Link label="Paste?" disabled />}
          secondRightButton={
            <Link disabled variant="secondary" icon={<ClipboardIcon />} showLeftIcon={true} />
          }
          disabled
          style={{ alignSelf: 'stretch' }}
        />
        <AppPinInput
          value={pinValue}
          onChange={setPinValue}
          isWrong={pinValue.length >= myPinValue.length && pinValue !== myPinValue}
        ></AppPinInput>
        <WalletBadge icon={require('assets/usdc.png')} label="My Wallet" onPress={() => {}} />

        <Badge
          label="Ethereum"
          size="small"
          // icon={<ExclamationCircleIcon></ExclamationCircleIcon>}
        />
        <Badge label="Ethereum" size="regular" icon={<ExclamationCircleIcon />} />
        <TrendingDirection percentageChange={4.82}></TrendingDirection>
        <TrendingTokenChip label={'USDC'} change={4.82} icon={require('assets/usdc.png')} />
        <TransactionItem
          from="0x1fe42423424d24"
          value={100}
          symbol="ETH"
          icon={require('assets/usdc.png')}
        />
        <TransactionItem
          to="0x1fe42423424d24"
          value={60.3}
          symbol="ETH"
          icon={require('assets/usdc.png')}
        />
        <WalletItem label="My Wallet" address="0x1fe42423424d24" onPress={() => alert('Hello')} />
        <AssetTokenItem
          label="My Token"
          chainName="Ethereum"
          symbol="ETH"
          icon={require('assets/usdc.png')}
          ownedAmount={1.23}
          percentageChange={4.82}
          fiatPriceEquivalent={172096.21}
          fiatCurrencySymbol="₺"
        />
        <GeneralTokenItem
          label="My Token"
          chainName="Ethereum"
          symbol="MTK"
          icon={require('assets/usdc.png')}
          tokenPrice={139683.34}
          priceCurrencySymbol="₺"
          percentageChange={4.82}
        />
        <AddTokenItem
          label="My Token"
          chainName="Ethereum"
          symbol="MTK"
          icon={require('assets/usdc.png')}
          on={tokenOn}
          onToggleToken={() => setTokenOn(!tokenOn)}
        />
        <FocusNote
          title="Secure your wallet"
          description="Store your seed phrase securely away"
          onClose={() => {}}
        />
        {/* <Chart /> */}
        <TextArea
          variant="stroke"
          placeholder="Placeholder"
          value={inputValue}
          error={inputError}
          setValue={newValue => {
            if (newValue.length > 100) {
              setInputError('Input too long');
            } else {
              setInputError(undefined);
            }
            setInputValue(newValue);
          }}
          style={{ alignSelf: 'stretch' }}
        />
        <TextArea
          variant="fill"
          placeholder="Placeholder"
          value={inputValue}
          error={inputError}
          setValue={newValue => {
            if (newValue.length > 100) {
              setInputError('Input too long');
            } else {
              setInputError(undefined);
            }
            setInputValue(newValue);
          }}
          style={{ alignSelf: 'stretch' }}
        />
      </ScrollView>
      {/* <SwapInput
        value={swapInputValue}
        balance={balance}
        tokenValue={selectorValue}
        setTokenValue={setSelectorValue}
        tokenItems={selectorItems}
        setTokenItems={setSelectorItems}
        setValue={newValue => {
          if (typeof newValue === 'string' && newValue.length < 3) {
            setSwapInputError(undefined);
            setSwapInputValue(newValue);
          } else if (typeof newValue === 'string') {
            setSwapInputError('Invalid input');
          }
        }}
        variant="fill"
        label="Swap"
        hint="You can swap any token"
        error={swapInputError}
      /> */}
      <View style={{ margin: 30 }}></View>
    </>
  );
};

export default Components;
