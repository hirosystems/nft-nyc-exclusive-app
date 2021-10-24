import React from 'react';
import { Button } from '@components/button';
import { claimToken } from '@hooks/button_actions';

export const ClaimPanel = props => {
    return (
        <Button
            size="lg"
            onClick={() => claimToken()}
        >
            Claim NFT
        </Button>
    );
  }