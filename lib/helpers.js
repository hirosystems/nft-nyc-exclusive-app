import { StacksMainnet, StacksMocknet } from "@stacks/network";
import { callReadOnlyFunction, cvToValue } from "@stacks/transactions";
import { Configuration, AccountsApi } from "@stacks/blockchain-api-client";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";

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
      icon: `${window.location.origin}/${APP_LOGO}`,
    },
    network: getNetwork(),
    onFinish: (data) => onFinish(data),
  };

  return await openContractCall(options);
}

export async function authWithConnect(onFinish) {
  const appConfig = new AppConfig(["store_write", "publish_data"]);
  const userSession = new UserSession({ appConfig });

  showConnect({
    appDetails: {
      name: APP_NAME,
      icon: `${window.location.origin}/${APP_LOGO}`,
    },
    redirectTo: "/",
    finished: () => onFinish,
    userSession: userSession,
  });
}

export async function getNFTCount(user, errorCallback) {
  let count = 0;
  const options = {
    contractAddress: CONTRACT_PRINCIPAL,
    contractName: CONTRACT_ID,
    functionName: CONTRACT_LAST_ID_METHOD,
    functionArgs: [],
    network: getNetwork(),
    senderAddress: getUserAddress(user), // will be empty if not logged in
  };

  try {
    const resp = await callReadOnlyFunction(options);
    count = parseInt(cvToValue(resp));
  } catch (e) {
    errorCallback(e);
    console.error(e);
  }

  return count;
}
