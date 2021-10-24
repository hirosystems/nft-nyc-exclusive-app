import { useAtom } from 'jotai'; 
import { networkAtom } from '@store/api'
import {
    openContractCall,
    FinishedTxData,
  } from "@stacks/connect";
import { txSentAtom } from '@store/tx-state';

export async function claimToken() {
    const [network] = useAtom(networkAtom);
    const [, setTxSentAtom] = useAtom(txSentAtom);
    // setIsLoading(true);
    const options = {
      contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      contractName: "nft-nyc-exclusive",
      functionName: "claim-swag",
      functionArgs: [],
      appDetails: {
        name: "Exclusive Bitcoin NFT for NFT.NYC",
        icon: window.location.origin + "/hiro-icon-black.png",
      },
      network,
      onFinish: (data: FinishedTxData) => {
        console.log('Transaction ID:', data.txId);
        console.log('Raw transaction:', data.txRaw);

        setTxSentAtom(true);
        // setIsLoading(false);
      },
    };

    await openContractCall(options);
  }