import React from 'react'; 
import { Box, Flex } from '@stacks/ui';
// import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'

export const MobileInfo = () => {
    return (
        <Flex align="center">
            <span>&#9432;</span>
            <Box>
                <b>Claim not supported on mobile</b>
                Unfortunately, this NFT can't be claimed from a mobile device. Please redeem from a desktop browswer (Chrome, Brave, or Firefox).
            </Box>
        </Flex>
    )
}