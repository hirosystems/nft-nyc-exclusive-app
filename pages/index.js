import React from "react";
import Head from "next/head";
import { AppConfig, UserSession } from "@stacks/connect";
import { Connect } from "@stacks/connect-react";
import { MicroStacksProvider } from "micro-stacks/react";
import { Container, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";

import Header from "../components/header";
import MobileNote from "../components/mobilenote";
import NFTPreview from "../components/nftpreview";
import Authenticate from "../components/auth";
import ClaimNFT from "../components/claim";
import ClaimSuccess from "../components/claimsuccess";
import ClaimDisabled from "../components/claimdisabled";
import FAQ from "../components/faq";

import {
  isLoggedIn,
  isBroadcasted,
  getNFTCount,
  getNetwork,
  getNetworkPrincipal,
} from "../lib/helpers";
import {
  APP_NAME,
  APP_LOGO,
  APP_WIDTH,
  CONTRACT_ID,
  CONTRACT_CLAIM_METHOD,
  MAX_TOKEN_AMOUNT,
} from "../lib/constants";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

export default function Home() {
  const [user, setUser] = useState({});
  const [tx, setTx] = useState("");
  const [claimed, setClaimed] = useState(false);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const toast = useToast();

  // check if user is logged in
  useEffect(() => {
    setIsLoading(true);
    if (userSession.isSignInPending()) {
      // redirect after successful sign in
      userSession.handlePendingSignIn().then((userData) => {
        window.history.replaceState({}, document.title, "/");
        setUser(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      // user is signed in
      setUser(userSession.loadUserData());
    }
    setIsLoading(false);
  }, [userSession]);

  // check if user already claimed NFT
  useEffect(async () => {
    setIsLoading(true);
    setClaimed(
      await isBroadcasted(user, (err) => {
        console.log(err);
        toast({
          title: "Could not load account details",
          description: err.message,
          status: "error",
          duration: 10000,
        });
        // disable minting
        setEnabled(false);
      })
    );
    setIsLoading(false);
  }, [userSession]);

  // check how many NFTs are minted
  useEffect(async () => {
    setIsLoading(true);
    const newCount = await getNFTCount((err) => {
      console.log(err);
      toast({
        title: "Could not load NFT count",
        description: err.message,
        status: "error",
        duration: 10000,
      });
      // disable minting
      setEnabled(false);
    });

    setCount(newCount);

    // disbale minting if max amount is reached
    if (newCount >= MAX_TOKEN_AMOUNT) {
      setEnabled(false);
    } else {
      setEnabled(true);
    }

    setIsLoading(false);
  }, [userSession]);

  const authOptions = {
    redirectTo: "/",
    userSession,
    onFinish: (payload) => {
      setUser(payload);
      setIsLoading(false);
    },
    onCancel: () => {
      setIsLoading(false);
    },
    appDetails: {
      name: APP_NAME,
      icon: `${window.location.href}/${APP_LOGO}`,
    },
  };

  const claimOptions = {
    contractAddress: getNetworkPrincipal(),
    contractName: CONTRACT_ID,
    functionName: CONTRACT_CLAIM_METHOD,
    functionArgs: [],
    network: getNetwork(),
    onFinish: (data) => {
      // success
      console.log("Transaction ID:", data.txId);
      console.log("Raw transaction:", data.txRaw);

      setTx(data.txId);
      setIsLoading(false);
    },
    onCancel: () => {
      setIsLoading(false);
    },
  };

  return (
    <Connect authOptions={authOptions}>
      <Container maxW={APP_WIDTH} minW={APP_WIDTH} p="2">
        <Head>
          <title>{APP_NAME}</title>
        </Head>
        <Header />
        <NFTPreview claimed={claimed || tx.length > 0} count={count} />
        {isMobile && <MobileNote />}
        {!isMobile && renderCTA()}
        {enabled && !claimed && tx.length === 0 && <FAQ />}
      </Container>
    </Connect>
  );

  function renderCTA() {
    if (!enabled) {
      return <ClaimDisabled />;
    }
    // if not signed in
    else if (!isLoggedIn(user)) {
      return (
        <Authenticate
          onStart={() => {
            setIsLoading(true);
          }}
          isLoading={isLoading}
        />
      );
    }
    // if signed in, not claimed, no transaction
    else if (isLoggedIn(user) && !claimed && tx.length === 0) {
      return (
        <ClaimNFT
          enabled={true}
          claimOptions={claimOptions}
          onStart={() => {
            setIsLoading(true);
          }}
          isLoading={isLoading}
        />
      );
    }
    // if signed in and claimed or transaction pending
    else if (isLoggedIn(user) && (claimed || tx.length > 0)) {
      return <ClaimSuccess user={user} />;
    }
  }
}
