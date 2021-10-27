import { Text, Center, VStack } from "@chakra-ui/react";
import { useConnect } from "@stacks/connect-react";
import PrimaryButton from "./primaryButton";

import { APP_NAME, AUTH_BUTTON_TEXT } from "../lib/constants";

export const Authenticate = ({ onStart, isLoading }) => {
  const { doOpenAuth } = useConnect();

  return (
    <Center>
      <VStack>
        <Text className="headerLabel" px={2} py={6}>
          {APP_NAME}
        </Text>
        <PrimaryButton
          text={AUTH_BUTTON_TEXT}
          onClick={() => {
            onStart();
            doOpenAuth();
          }}
          enabled={true}
          loading={isLoading}
        />
      </VStack>
    </Center>
  );
};

export default Authenticate;
