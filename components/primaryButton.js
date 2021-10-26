import { Button } from "@chakra-ui/react";

export const PrimaryButton = ({ text, onClick, enabled }) => {
  return (
    <Button
      colorScheme="blue"
      className="primaryButton"
      isDisabled={!enabled}
      onClick={() => (enabled ? onClick() : null)}
    >
      {text}
    </Button>
  );
};

export default PrimaryButton;
