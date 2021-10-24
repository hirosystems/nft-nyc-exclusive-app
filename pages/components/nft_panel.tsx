import React from 'react';
import {
    Box, 
    Stack,
  } from "@stacks/ui";
import { InstructionPanel } from '@components/instruction_panel';


export const NFTPanel = props => {
    return (
        <Stack justify="center">
            <Box margin="10px" border="5px" borderColor="gray.200" >
                <Box alt="nft" borderRadius="10px">
                    <video
                    width="100%"
                    height="100%"
                    src="NFT-NYC-Hiro.webm"
                    // type="video/webm"
                    preload="true"
                    autoPlay
                    loop
                    muted
                    />
                </Box>
            </Box>
            <Box justify="center" align="center">
                Claim Hiro's Special Edition NFT
                
            </Box>
            <InstructionPanel />
        </Stack>
    );
};
