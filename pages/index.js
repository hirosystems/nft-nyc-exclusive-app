import Head from "next/head";
import { AppConfig, UserSession, openContractCall } from "@stacks/connect";
import {
  Container,
  Text,
  Button,
  Box,
  Spacer,
  VStack,
  StackDivider,
  Link,
} from "@chakra-ui/react";
import Confetti from "react-confetti";
import { ArrowForwardIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { callReadOnlyFunction, cvToValue } from "@stacks/transactions";
import { Configuration, AccountsApi } from "@stacks/blockchain-api-client";

import Header from "../components/Header";
import NFTPreview from "../components/nftpreview";
import Authenticate from "../components/auth";
import ClaimNFT from "../components/claim";
import FAQ from "../components/faq";

import { getNetwork } from "../lib/helpers";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

// set to DevNet if in development
const network = getNetwork();

export default function Home({ props }) {
  const [user, setUser] = useState({});
  const [tx, setTx] = useState("");
  const [claimed, setClaimed] = useState(false);
  const [available, setAvailable] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userSession.isSignInPending()) {
      // redirect after successful sign in
      userSession.handlePendingSignIn().then((userData) => {
        window.history.replaceState({}, document.title, "/");
        setUser(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      // user is signed in
      setUser(getUserData());
    }
  }, [userSession]);

  // once user is set, check if already claimed NFT
  useEffect(async () => {
    if (Object.keys(user).length > 0) {
      const claimedCheck = await checkIfClaimed(
        user.profile.stxAddress.mainnet
      );
      setClaimed(claimedCheck);
    }
  }, [user]);

  function renderClaimView() {
    return (
      <Box p="6" m="2" d="flex">
        <Text color="gray.100" fontSize="4xl" fontWeight="bold">
          Claim Exclusive Bitcoin NFT
        </Text>
        <Spacer />
        {Object.keys(user).length === 0 && (
          <Button onClick={() => authenticate()}>Get started</Button>
        )}
        {Object.keys(user).length > 0 && (
          <Button
            colorScheme="blue"
            size="lg"
            rightIcon={<ArrowForwardIcon />}
            onClick={() => claimToken()}
            isLoading={isLoading}
          >
            Go
          </Button>
        )}
      </Box>
    );
  }

  function renderFinishView() {
    return (
      <Box p="6" m="2" d="flex" flexDirection="column">
        <VStack
          divider={<StackDivider borderColor="gray.200" w="100%" />}
          alignItems="initial"
        >
          <Box d="flex" p="2">
            <Text color="gray.100" fontSize="xl" fontWeight="bold">
              Display your NFT
            </Text>
            <Spacer />
            <Link
              href={`https://explorer.stacks.co/address/${user.profile.stxAddress.mainnet}`}
              isExternal
            >
              <Button colorScheme="blue" rightIcon={<ExternalLinkIcon />}>
                Explorer
              </Button>
            </Link>
          </Box>
          <Box d="flex" p="2">
            <Text color="gray.100" fontSize="xl" fontWeight="bold">
              Learn more about Stacks NFTs
            </Text>
            <Spacer />
            <Link
              href="https://forum.stacks.org/t/nfts-on-stacks-starter-info/11872"
              isExternal
            >
              <Button colorScheme="blue" rightIcon={<ExternalLinkIcon />}>
                Forum
              </Button>
            </Link>
          </Box>
          <Box d="flex" p="2">
            <Text color="gray.100" fontSize="xl" fontWeight="bold">
              Create your own NFT
            </Text>
            <Spacer />
            <Link
              href="https://docs.hiro.so/docs/tutorials/clarity-nft"
              isExternal
            >
              <Button colorScheme="blue" rightIcon={<ExternalLinkIcon />}>
                Docs
              </Button>
            </Link>
          </Box>
        </VStack>
      </Box>
    );
  }

  async function claimToken() {
    setIsLoading(true);
    const options = {
      contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      contractName: "nft-nyc-exclusive",
      functionName: "mint",
      functionArgs: [],
      appDetails: {
        name: "Hiro's Special Edition Bitcoin NFT",
        icon: window.location.origin + "/hiro-icon-black.png",
      },
      network,
      onFinish: (data) => {
        console.log("Transaction ID:", data.txId);
        console.log("Raw transaction:", data.txRaw);

        setTx(data.txId);
        setIsLoading(false);
      },
    };

    await openContractCall(options);
  }

  function getUserData() {
    return userSession.loadUserData();
  }

  return (
    <Container maxW="480px" p="2">
      <Head>
        <title>Claim your exclusive Bitcoin NFT</title>
      </Head>

      <Header />
      <NFTPreview claimed={claimed} available={available} />
      {Object.keys(user).length === 0 && tx === "" && !claimed && (
        <Authenticate />
      )}
      {Object.keys(user).length > 0 && tx === "" && !claimed && <ClaimNFT />}
      <FAQ />

      <Box
        borderWidth="1px"
        borderRadius="lg"
        fontWeight="semibold"
        letterSpacing="wide"
        fontSize="xs"
        overflow="hidden"
        position="relative"
      >
        {claimed && <Confetti height="550px" />}
        {tx === "" && claimed && renderClaimView()}
        {Object.keys(user).length > 0 &&
          tx !== "" &&
          !claimed &&
          renderFinishView()}
      </Box>
    </Container>
  );
}

async function checkIfClaimed(principal) {
  const fetch = window.fetch.bind(window);

  const apiConfig = new Configuration({
    fetchApi: fetch,
    basePath:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3999"
        : "https://stacks-node-api.mainnet.stacks.co",
  });

  // initiate the /accounts API with the basepath and fetch library
  const accountsApi = new AccountsApi(apiConfig);

  // get transactions for a specific account
  const assets = await accountsApi.getAccountAssets({
    principal,
  });

  // check if `nft-nyc-exclusive` is available
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

  setAvailable();

  return swagAvailable > 0;
}

async function getContractData() {
  const contractAddress = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
  const contractName = "nft-nyc-exclusive";
  const functionName = "get-last-token-id";

  const options = {
    contractAddress,
    contractName,
    functionName,
    functionArgs: [],
    network,
    senderAddress: contractAddress,
  };

  const result = await callReadOnlyFunction(options);

  return cvToValue(result);
}

export async function getStaticProps() {
  const available = { value: true }; // await getContractData();

  return {
    props: {
      available: available.value,
    },
  };
}
