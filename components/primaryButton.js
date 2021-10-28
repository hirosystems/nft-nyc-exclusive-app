import { Button } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';

export const PrimaryButton = ({ text, onClick, enabled, loading = false, green }) => {
  return (
    <Button
      className={`primaryButton${green ? ' greenButton' : ''}`}
      rightIcon={green ? <ArrowForwardIcon /> : null}
      isDisabled={!enabled}
      isLoading={loading}
      onClick={() => (enabled ? onClick() : null)}
    >
      {text}
    </Button>
  );
};

export default PrimaryButton;
