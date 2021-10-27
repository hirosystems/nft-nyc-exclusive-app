import { Text, Center, VStack, Link } from "@chakra-ui/react";
import PrimaryButton from "./primaryButton";

import { CLAIM_SUCCESS_LABEL } from "../lib/constants";

export const ClaimSuccess = (props) => {
  return (
    <Center>
      <VStack>
        <Text className="headerLabel" px={2} py={6}>
          {CLAIM_SUCCESS_LABEL}
        </Text>
      </VStack>
    </Center>
  );
};

export default ClaimSuccess;
