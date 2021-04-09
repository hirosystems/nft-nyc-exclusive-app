import Head from "next/head";
import {
  AppConfig,
  UserSession,
  showConnect,
  openContractCall,
} from "@stacks/connect";
import { Person } from "@stacks/profile";
import { Button, Flex, Text } from "@stacks/ui";
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
    <Flex maxHeight="900px" flexDirection="column" p="loose">
      <Head>
        <title>Claim your first Bitcoin NFT</title>
      </Head>
      <Text fontWeight={500} mt="64px" as="h1" fontSize="36px">
        Claim your first Bitcoin NFT
      </Text>
      {Object.keys(user).length === 0 && (
        <Button onClick={() => authenticate()}>Authenticate</Button>
      )}
      {Object.keys(user).length > 0 && showClaimSection(user)}
    </Flex>
  );
}

function showClaimSection(user) {
  return (
    <>
      <Text>Logged in as {user.profile.stxAddress.testnet}</Text>
      <Button onClick={() => claimToken()}>Claim SWAG-100 NFT</Button>
    </>
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
