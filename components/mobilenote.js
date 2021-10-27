import {
  Text,
  Center,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from "@chakra-ui/react";
import {
  APP_NAME,
  MOBILE_ERROR_TITLE,
  MOBILE_ERROR_MESSAGE,
} from "../lib/constants";

export const MobileNote = () => {
  return (
    <Center p={2}>
      <VStack>
        <Text className="headerLabel" py={6} mb={4}>
          {APP_NAME}
        </Text>
        <Alert status="info" p={4} borderRadius="16px">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>{MOBILE_ERROR_TITLE}</AlertTitle>
            <AlertDescription>{MOBILE_ERROR_MESSAGE}</AlertDescription>
          </Box>
        </Alert>
      </VStack>
    </Center>
  );
};

export default MobileNote;
