import { atom, useAtom } from 'jotai'; 
import { accountClientsAtom } from '@store/api';
import { userAtom } from '@store/auth';

export const txSentAtom = atom(false); 
export const nftClaimedAtom = atom(get => {
    const txSent = get(txSentAtom); 
    
    const user = get(userAtom);
    if (!user) { // will be undefined if user is not signed in 
        return false;
    }

    const nftClaimedInAccount = checkIfClaimed(user.profile.stxAddress.mainnet); 
    return txSent || nftClaimedInAccount;
}); 

// this function returns boolean signifying whether the given principal owns the NFT
export async function checkIfClaimed(principal: string) {
    // get the /accounts API 
    const [accountsApi] = useAtom(accountClientsAtom);
  
    // get transactions for a specific account
    const assets = await accountsApi.getAccountAssets({
      principal,
    });
  
    // check if `nft-nyc-exclusive` is owned by this principal
    const swagAvailable = assets.results
      .filter((asset) => asset.event_type === "non_fungible_token_asset")
      .reduce((acc, nft) => {
        if (
          nft.asset.asset_id ===
          "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-nyc-exclusive::nft-nyc-exclusive"
        ) {
          return acc + 1;
        }
  
        return acc;
      }, 0);
  
    return swagAvailable > 0;
  }