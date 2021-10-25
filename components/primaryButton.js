import { Button } from "@chakra-ui/react";

export const PrimaryButton = ({ text }) => {
  return (
    <Button colorScheme="blue" className="primaryButton">
      {text}
    </Button>
  );
};

export default PrimaryButton;
