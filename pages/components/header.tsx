import React from 'react';
import { Box, Stack, Text} from '@stacks/ui';


export const HeaderPanel = () => {
    return (
        <Stack isInline justify="center" align="center" p="25px">
            <img src="/hiro-icon-black.png" width="md"/>
            <Text p="10px" fontSize="md">Hiro</Text>
        </Stack>
    )
}