import { StacksMainnet, StacksMocknet } from "@stacks/network";
import { Configuration, AccountsApi } from "@stacks/blockchain-api-client";

const MOCKNET_API_URL = "http://localhost:3999";
const MAINNET_API_URL = "https://stacks-node-api.mainnet.stacks.co";

export function isConnected() {
  return false;
}

export function isLoggedIn(user) {
  return Object.keys(user).length > 0;
}

export async function isBroadcasted(user) {
  const stxAddress =
    process.env.NODE_ENV === "development"
      ? user.profile.stxAddress.testnet
      : user.profile.stxAddress.mainnet;
  if (isLoggedIn(user)) {
    const assets = await fetchAccountAssets(stxAddress);
    return ownsSpecialNFT(assets);
  }
  return false;
}

export function getNetwork() {
  return process.env.NODE_ENV === "development"
    ? new StacksMocknet()
    : new StacksMainnet();
}

export async function fetchAccountAssets(principal) {
  const fetch = window.fetch.bind(window);

  const apiConfig = new Configuration({
    fetchApi: fetch,
    basePath:
      process.env.NODE_ENV === "development"
        ? MOCKNET_API_URL
        : MAINNET_API_URL,
  });

  // initiate the /accounts API with the basepath and fetch library
  const accountsApi = new AccountsApi(apiConfig);

  // get transactions for a specific account
  return await accountsApi.getAccountAssets({
    principal,
  });
}

export function ownsSpecialNFT(assets) {
  // check if `nft-nyc-exclusive` is available
  const specialTokenCount = assets.results
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

  return specialTokenCount > 0;
}
