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
  VStack,
  StackDivider,
  Link,
} from "@chakra-ui/react";
import { ArrowForwardIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { Person } from "@stacks/profile";
import { useState, useEffect } from "react";
import { StacksTestnet, StacksMainnet } from "@stacks/network";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

export default function Home() {
  const [user, setUser] = useState({});
  const [tx, setTx] = useState("");
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

  function renderClaimView() {
    return (
      <Box p="6" m="2" d="flex">
        <Text color="gray.100" fontSize="4xl" fontWeight="bold">
          Claim Bitcoin NFT
        </Text>
        <Spacer />
        {Object.keys(user).length === 0 && (
          <Button onClick={() => authenticate()}>Authenticate</Button>
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
        <VStack divider={<StackDivider borderColor="gray.200" w="100%" />} alignItems="initial">
          <Box d="flex" p="2">
            <Text color="gray.100" fontSize="xl" fontWeight="bold">
              Display your NFT
            </Text>
            <Spacer />
            <Link
              href={`https://explorer.stacks.co/txid/${tx}?chain=testnet`}
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
              href="https://docs.blockstack.org/write-smart-contracts/overview"
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
      network: new StacksTestnet(),
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

  return (
    <Container maxW="xl" p="2">
      <Head>
        <title>Claim your first Bitcoin NFT</title>
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charset="utf-8"
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
        <Tag position="absolute" top="10px" right="10px" colorScheme="orange">
          Limited to 100
        </Tag>
        <Image objectFit="cover" src="powerful.svg" bg="gray.500" alt="nft" />
        {tx === "" && renderClaimView()}
        {tx !== "" && renderFinishView()}
      </Box>
      <Box mt="12" width="100%" height="300px" overflow="scroll">
        <a className="twitter-timeline" href="https://twitter.com/Stacks" />
      </Box>
    </Container>
  );
}
