import { Button } from "@chakra-ui/react";

export const PrimaryButton = ({ text, onClick }) => {
  return (
    <Button colorScheme="blue" className="primaryButton" onClick={() => onClick()}>
      {text}
    </Button>
  );
};

export default PrimaryButton;
