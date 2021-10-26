import { Text, Center, VStack, Link } from "@chakra-ui/react";
import PrimaryButton from "./primaryButton";

function claim() {
  console.log("claim");
}

export const ClaimNFT = (props) => {
  return (
    <Center>
      <VStack>
        <Text className="headerLabel" px={2} py={6}>
          Claim Hiro’s Special Edition Bitcoin NFT
        </Text>
        <PrimaryButton text="Claim NFT" onClick={claim} />
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
