import Head from "next/head";
import {
  AppConfig,
  UserSession,
  showConnect,
  openContractCall,
} from "@stacks/connect";
import {
  Container,
  Text,
  Button,
  Box,
  Spacer,
  Tag,
  VStack,
  StackDivider,
  Link,
} from "@chakra-ui/react";
import Confetti from "react-confetti";
import { ArrowForwardIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { StacksMainnet } from "@stacks/network";
import { callReadOnlyFunction, cvToValue } from "@stacks/transactions";
import { Configuration, AccountsApi } from "@stacks/blockchain-api-client";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

const network = new StacksMainnet();

export default function Home({ available }) {
  const [user, setUser] = useState({});
  const [tx, setTx] = useState("");
  const [claimed, setClaimed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        window.history.replaceState({}, document.title, "/");
        setUser(userData);
      });
    } else if (userSession.isUserSignedIn()) {
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
          Claim Bitcoin NFT
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
    // TODO: Replace the tutorial URL once merged
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
              href={`https://explorer.stacks.co/address/${user.profile.stxAddress.mainnet}?chain=mainnet`}
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
              href="https://blockstack-docs-git-feat-nft-onboarding-blockstack.vercel.app/write-smart-contracts/my-own-nft"
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
      contractAddress: "ST2D2YSXSNFVXJDWYZ4QWJVBXC590XSRV5AMMCW0",
      contractName: "swag-100",
      functionName: "claim-swag",
      sponsored: true,
      functionArgs: [],
      appDetails: {
        name: "Bitcoin NFT on Stacks",
        icon: window.location.origin + "/vercel.svg",
      },
      network,
      onFinish: async (data) => {
        console.log("Stacks Transaction:", data.stacksTransaction);
        console.log("Raw transaction:", data.txRaw);

        const resp = await signSponsoredTx(data.txRaw);

        console.log(resp);

        setTx(resp.txid);
        setIsLoading(false);
      },
    };

    await openContractCall(options);
  }

  async function signSponsoredTx(txRaw) {
    const res = await fetch(`/api/broadcast?txRaw=${txRaw}`);
    const data = await res.json();

    return data;
  }

  function authenticate() {
    showConnect({
      appDetails: {
        name: "Bitcoin NFT",
        icon: window.location.origin + "/vercel.svg",
      },
      redirectTo: "/",
      finished: () => {
        window.location.reload();
      },
      userSession: userSession,
    });
  }

  function getUserData() {
    return userSession.loadUserData();
  }

  return (
    <Container maxW="xl" p="2">
      <Head>
        <title>Claim your first Bitcoin NFT</title>
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charSet="utf-8"
        ></script>
      </Head>

      <Box
        borderWidth="1px"
        borderRadius="lg"
        bg="gray.800"
        fontWeight="semibold"
        letterSpacing="wide"
        fontSize="xs"
        overflow="hidden"
        position="relative"
      >
        {claimed && <Confetti height="550px" />}
        {claimed && (
          <Tag position="absolute" top="500px" left="23%" colorScheme="green">
            {`Congrats! You got one of only 100 NFTs`}
          </Tag>
        )}
        {!claimed && (
          <Tag position="absolute" top="10px" right="10px" colorScheme="cyan">
            {`Limited to 100! Only ${100 - available} left`}
          </Tag>
        )}
        <Box bg="gray.500" alt="nft" objectFit="cover">
          <video
            width="auto"
            height="100%"
            src="nft1.webm"
            type="video/webm"
            preload="true"
            autoPlay
            loop
            muted
          />
        </Box>
        {tx === "" && !claimed && renderClaimView()}
        {(tx !== "" || claimed) && renderFinishView()}
      </Box>
      <Box mt="12" width="100%" height="300px" overflow="scroll">
        <a className="twitter-timeline" href="https://twitter.com/Stacks" />
      </Box>
    </Container>
  );
}

async function checkIfClaimed(principal) {
  const fetch = window.fetch.bind(window);

  const apiConfig = new Configuration({
    fetchApi: fetch,
    basePath: "https://stacks-node-api.mainnet.stacks.co",
  });

  // initiate the /accounts API with the basepath and fetch library
  const accountsApi = new AccountsApi(apiConfig);

  // get transactions for a specific account
  const assets = await accountsApi.getAccountAssets({
    principal,
  });

  // check if `swag-100` is available
  const swagAvailable = assets.results
    .filter((asset) => asset.event_type === "non_fungible_token_asset")
    .reduce((acc, nft) => {
      if (
        nft.asset.asset_id ===
        "ST2D2YSXSNFVXJDWYZ4QWJVBXC590XSRV5AMMCW0.swag-100::swag-100"
      ) {
        return acc + 1;
      }

      return acc;
    }, 0);

  return swagAvailable > 0;
}

async function getContractData() {
  const contractAddress = "ST2D2YSXSNFVXJDWYZ4QWJVBXC590XSRV5AMMCW0";
  const contractName = "swag-100";
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
  const available = await getContractData();

  return {
    props: {
      available: available.value,
    },
  };
}
