import { StacksMainnet, StacksMocknet } from "@stacks/network";
import { cvToString } from "@stacks/transactions";
import {
  Configuration,
  AccountsApi,
  SmartContractsApi,
} from "@stacks/blockchain-api-client";

import {
  MOCKNET_API_URL,
  MAINNET_API_URL,
  CONTRACT_PRINCIPAL,
  CONTRACT_ID,
  CONTRACT_CLAIM_METHOD,
  CONTRACT_LAST_ID_METHOD,
  APP_LOGO,
  APP_NAME,
} from "./constants";

export function isConnected() {
  return false;
}

export function isLoggedIn(user) {
  return user && Object.keys(user).length > 0;
}

export function getUserAddress(user) {
  if (!user || !isLoggedIn(user)) return "";

  return process.env.NODE_ENV === "development"
    ? user.profile.stxAddress.testnet
    : user.profile.stxAddress.mainnet;
}

export async function isBroadcasted(user) {
  if (user && isLoggedIn(user)) {
    const assets = await fetchAccountAssets(getUserAddress(user));
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
        `${CONTRACT_PRINCIPAL}.${CONTRACT_ID}::${CONTRACT_ID}`
      ) {
        return acc + 1;
      }

      return acc;
    }, 0);

  return specialTokenCount > 0;
}

export async function claimNFT(onFinish) {
  const options = {
    contractAddress: CONTRACT_PRINCIPAL,
    contractName: CONTRACT_ID,
    functionName: CONTRACT_CLAIM_METHOD,
    functionArgs: [],
    appDetails: {
      name: APP_NAME,
      icon: `/${APP_LOGO}`,
    },
    network: getNetwork(),
    onFinish: (data) => onFinish(data),
  };

  return await openContractCall(options);
}
export async function caallReadOnlyLastId() {
  const fetch = window.fetch.bind(window);

  const apiConfig = new Configuration({
    fetchApi: fetch,
    basePath:
      process.env.NODE_ENV === "development"
        ? MOCKNET_API_URL
        : MAINNET_API_URL,
  });

  // initiate the Smart Contracts API with the basepath and fetch library
  const smartContractsApi = new SmartContractsApi(apiConfig);

  // get transactions for a specific account
  return await smartContractsApi.callReadOnlyFunction({
    contractAddress: CONTRACT_PRINCIPAL,
    contractName: CONTRACT_ID,
    functionName: CONTRACT_LAST_ID_METHOD,
    readOnlyFunctionArgs: {
      sender: CONTRACT_PRINCIPAL,
      arguments: [],
    },
  });
}

export async function getNFTCount(user, errorCallback) {
  let count = 0;

  try {
    const resp = await caallReadOnlyLastId();

    if (resp.okay && resp.result) {
      console.log(resp, cvToString(resp));
      // count = X
    }
  } catch (e) {
    errorCallback(e);
  }

  return count;
}
