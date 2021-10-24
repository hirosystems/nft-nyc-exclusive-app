import React from 'react'; 
import { Box } from '@stacks/ui'
import { Button } from '@components/button';
// import { Link } from "@chakra-ui/react" // todo - try to use 

// TODO: use same component as mobile - just pass in a property here to signify we are on desktop
export const DownloadWallet = props => {
    if (props.isSafariDesktop) {
        return (
            <Box>
                Hiro Wallet is not supported on Safari. Please use Chrome, Brave, or Firefox. 
            </Box>
        )
    }
    return ( 
        <Box>
            <Button
                    isLoading={false} //todo
                    onClick={() => {
                        // claimToken(); // todo - change call 
                    }}
                    {...props}
                >
                    Download Hiro Wallet
            </Button>
            <Box justify="center">
                New to Stacks? Gain some time and <a href="www.google.com" target="_blank">Buy STX</a>
            </Box>
        </Box>
    )
}