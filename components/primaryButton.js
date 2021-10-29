import { Button } from '@chakra-ui/react';

export const PrimaryButton = ({ text, onClick, enabled, loading = false, highlighted = false }) => {
  return (
    <Button
      className={`primaryButton ${highlighted ? 'highlight' : ''}`}
      isDisabled={!enabled}
      isLoading={loading}
      onClick={() => (enabled ? onClick() : null)}
    >
      {text}
    </Button>
  );
};

export default PrimaryButton;
