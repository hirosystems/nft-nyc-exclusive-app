import React from 'react'; 
import { Button } from '@components/button';
import { authenticate } from '@store/auth';

export const ConnectWallet = props => {
    return ( 
        <Button
                onClick={() => {
                    authenticate(); 
                }}
                {...props}
            >
                Connect Hiro Wallet
        </Button>
    )
}
