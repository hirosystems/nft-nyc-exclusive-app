import React from 'react'; 
import { Box } from '@stacks/ui';

export const FinishedPanel = props => {
    return ( 
        <Box> 
            Your NFT has been claimed. 
        </Box>
    )
}


// function renderFinishView() {
//     return (
//       <Box p="6" m="2" d="flex" flexDirection="column">
//         <VStack
//           divider={<StackDivider borderColor="gray.200" w="100%" />}
//           alignItems="initial"
//         >
//           <Box d="flex" p="2">
//             <Text color="gray.50" fontSize="xl" fontWeight="bold">
//               Display your NFT
//             </Text>
//             <Spacer />
//             <Link
//               href={`https://explorer.stacks.co/`}
//               isExternal
//             >
//               <Button colorScheme="blue" rightIcon={<ExternalLinkIcon />}>
//                 Explorer
//               </Button>
//             </Link>
//           </Box>
//           <Box d="flex" p="2">
//             <Text color="gray.100" fontSize="xl" fontWeight="bold">
//               Learn more about Stacks NFTs
//             </Text>
//             <Spacer />
//             <Link
//               href="https://forum.stacks.org/t/nfts-on-stacks-starter-info/11872"
//               isExternal
//             >
//               <Button colorScheme="blue" rightIcon={<ExternalLinkIcon />}>
//                 Forum
//               </Button>
//             </Link>
//           </Box>
//           <Box d="flex" p="2">
//             <Text color="gray.100" fontSize="xl" fontWeight="bold">
//               Create your own NFT
//             </Text>
//             <Spacer />
//             <Link
//               href="https://docs.hiro.so/docs/tutorials/clarity-nft"
//               isExternal
//             >
//               <Button colorScheme="blue" rightIcon={<ExternalLinkIcon />}>
//                 Docs
//               </Button>
//             </Link>
//           </Box>
//         </VStack>
//       </Box>
//     );
//   }