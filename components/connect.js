import { Text, Center, VStack, Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import PrimaryButton from "./primaryButton";

export const Connect = (props) => {
  return (
    <Center>
      <VStack>
        <Text className="headerLabel" px={2} py={6}>
          Claim Hiro’s Special Edition Bitcoin NFT
        </Text>
        <PrimaryButton text="Download Hiro Wallet" />
        <Text className="subText" px={2} py={6}>
          New to Stacks? Gain some time and
          <Link
            href="https://chakra-ui.com"
            color="purple.700"
            isExternal
            pl={1}
          >
            buy STX
          </Link>
        </Text>
      </VStack>
    </Center>
  );
};

export default Connect;
