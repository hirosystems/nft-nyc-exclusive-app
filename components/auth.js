import { Text, Center, VStack } from '@chakra-ui/react';
import PrimaryButton from './primaryButton';

import { APP_NAME, AUTH_BUTTON_TEXT } from '../lib/constants';
import { useAuth } from 'micro-stacks/react';

export const Authenticate = () => {
  const { handleSignIn, isLoading } = useAuth();

  return (
    <Center>
      <VStack>
        <Text className="headerLabel" px={2} py={6}>
          {APP_NAME}
        </Text>
        <PrimaryButton
          text={AUTH_BUTTON_TEXT}
          onClick={() => handleSignIn()}
          enabled={true}
          loading={isLoading}
        />
      </VStack>
    </Center>
  );
};

export default Authenticate;
