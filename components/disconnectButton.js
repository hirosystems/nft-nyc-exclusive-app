import { Button } from '@chakra-ui/react';
import { useAuth } from 'micro-stacks/react';
import { DISCONNECT_BUTTON_TEXT } from '../lib/constants';

export const DisconnectButton = () => {
  const { handleSignOut } = useAuth();

  return (
    <Button className="secondaryButton" onClick={() => handleSignOut()}>
      {DISCONNECT_BUTTON_TEXT}
    </Button>
  );
};

export default DisconnectButton;
