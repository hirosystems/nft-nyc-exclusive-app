import { Text, Center, VStack } from "@chakra-ui/react";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";

import PrimaryButton from "./primaryButton";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

function authenticate() {
  showConnect({
    appDetails: {
      name: "Hiro's Special Edition Bitcoin NFT",
      icon: window.location.origin + "/hiro-logo.png",
    },
    redirectTo: "/",
    finished: () => {
      window.location.reload();
    },
    userSession: userSession,
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
        />
      </VStack>
    </Center>
  );
};

export default Authenticate;
