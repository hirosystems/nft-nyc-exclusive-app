import Head from "next/head";
import {
  AppConfig,
  UserSession,
  showConnect,
  openContractCall,
} from "@stacks/connect";
import {
  Container,
  Flex,
  Image,
  Text,
  Button,
  Box,
  Spacer,
  Tag,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Person } from "@stacks/profile";
import { useState, useEffect } from "react";
import { StacksTestnet, StacksMainnet } from "@stacks/network";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

export default function Home() {
  const [user, setUser] = useState({});
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

  return (
    <Container maxW="xl" centerContent p="2">
      <Head>
        <title>Claim your first Bitcoin NFT</title>
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charset="utf-8"
        ></script>
      </Head>

      <Flex>
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
          <Tag position="absolute" top="10px" right="10px">
            Limited to 100
          </Tag>
          <Image objectFit="cover" src="powerful.svg" bg="gray.500" alt="nft" />
          <Box p="6" alignItems="center" m="2" d="flex">
            <Text color="gray.100" fontSize="4xl" fontWeight="bold">
              Claim Bitcoin NFT
            </Text>
            <Spacer />
            {Object.keys(user).length === 0 && (
              <Button onClick={() => authenticate()}>Authenticate</Button>
            )}
            {Object.keys(user).length > 0 && showClaimSection(user)}
          </Box>
        </Box>
      </Flex>
      <Box mt="12" width="100%" height="300px" overflow="scroll">
        <a class="twitter-timeline" href="https://twitter.com/Stacks" />
      </Box>
    </Container>
  );
}

function showClaimSection(user) {
  return (
    <Button
      colorScheme="blue"
      size="lg"
      rightIcon={<ArrowForwardIcon />}
      onClick={() => claimToken()}
    >
      Go
    </Button>
  );
}

async function claimToken() {
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
    network: new StacksTestnet(),
    onFinish: async (data) => {
      console.log("Stacks Transaction:", data.stacksTransaction);
      console.log("Raw transaction:", data.txRaw);

      console.log(await signSponsoredTx(data.txRaw));
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
      name: "Bitcoin NFT on Stacks",
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

function getPerson() {
  return new Person(getUserData().profile);
}
