import { Text, Center, VStack, Link } from '@chakra-ui/react';
import PrimaryButton from './primaryButton';

import { APP_NAME } from '../lib/constants';
import { useTransactionPopup } from 'micro-stacks/react';

export const ClaimNFT = ({ enabled, claimOptions }) => {
  const { handleContractCall, isLoading } = useTransactionPopup();

  return (
    <Center>
      <VStack>
        <Text className="headerLabel" px={2} py={6}>
          {APP_NAME}
        </Text>
        <PrimaryButton
          text="Claim NFT"
          onClick={() => handleContractCall(claimOptions)}
          green={true}
          enabled={enabled}
          loading={isLoading}
        />
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
      </VStack>
    </Center>
  );
};

export default ClaimNFT;
