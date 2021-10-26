import { Text, Center, VStack } from "@chakra-ui/react";

import { authWithConnect } from "../lib/helpers";
import PrimaryButton from "./primaryButton";

function authenticate() {
  authWithConnect(() => {
    window.location.reload();
  });
}

export const Authenticate = (props) => {
  return (
    <Center>
      <VStack>
        <Text className="headerLabel" px={2} py={6}>
          Claim Hiro’s Special Edition Bitcoin NFT
        </Text>
        <PrimaryButton
          text="Connect Hiro Wallet for web"
          onClick={authenticate}
          enabled={true}
        />
      </VStack>
    </Center>
  );
};

export default Authenticate;
