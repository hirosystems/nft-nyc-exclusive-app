import { Text, Center, VStack, Link } from '@chakra-ui/react';
import PrimaryButton from './primaryButton';

import { APP_NAME } from '../lib/constants';
import { useTransactionPopup } from 'micro-stacks/react';
import OnboardingLabel from './onboardingLabel';

export const ClaimNFT = ({ enabled, claimOptions }) => {
  const { handleContractCall } = useTransactionPopup();

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
        />
        <OnboardingLabel />
      </VStack>
    </Center>
  );
};

export default ClaimNFT;
