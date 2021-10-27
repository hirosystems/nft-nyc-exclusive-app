import { Button } from "@chakra-ui/react";

export const PrimaryButton = ({ text, onClick, enabled, loading = false }) => {
  return (
    <Button
      colorScheme="blue"
      className="primaryButton"
      isDisabled={!enabled}
      isLoading={loading}
      onClick={() => (enabled ? onClick() : null)}
    >
      {text}
    </Button>
  );
};

export default PrimaryButton;
