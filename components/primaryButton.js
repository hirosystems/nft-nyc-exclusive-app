import { Button } from "@chakra-ui/react";

export const PrimaryButton = ({
  text,
  onClick,
  enabled,
  loading = false,
  green,
}) => {
  return (
    <Button
      className={`primaryButton${green ? " greenButton" : ""}`}
      isDisabled={!enabled}
      isLoading={loading}
      onClick={() => (enabled ? onClick() : null)}
    >
      {text}
    </Button>
  );
};

export default PrimaryButton;
