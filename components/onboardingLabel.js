import { Text, Link } from '@chakra-ui/react';

export const OnboardingLabel = () => {
  return (
    <Text className="subText" px={2} py={6}>
      New to Stacks?{' '}
      <Link href="https://www.hiro.so/wallet/install-web" color="purple.700" isExternal>
        Download Hiro Wallet for web
      </Link>{' '}
      and{' '}
      <Link
        href="https://coinmarketcap.com/currencies/stacks/markets/"
        color="purple.700"
        isExternal
      >
        get STX
      </Link>
    </Text>
  );
};

export default OnboardingLabel;
