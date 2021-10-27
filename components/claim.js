import { useConnect } from "@stacks/connect-react";
import { Text, Center, VStack, Link } from "@chakra-ui/react";
import PrimaryButton from "./primaryButton";

import { APP_NAME } from "../lib/constants";

export const ClaimNFT = ({ enabled, claimOptions, onStart, isLoading }) => {
  const { doContractCall } = useConnect();

  return (
    <Center>
      <VStack>
        <Text className="headerLabel" px={2} py={6}>
          {APP_NAME}
        </Text>
        <PrimaryButton
          text="Claim NFT"
          onClick={() => {
            onStart();
            doContractCall(claimOptions);
          }}
          enabled={enabled}
          loading={isLoading}
        />
        <Text className="subText" px={2} py={6}>
          New to Stacks?{" "}
          <Link
            href="https://www.hiro.so/wallet/install-web"
            color="purple.700"
            isExternal
          >
            Download Hiro Wallet for web
          </Link>{" "}
          and{" "}
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
