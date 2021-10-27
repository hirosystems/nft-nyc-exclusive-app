import React from "react";
import Head from "next/head";
import { AppConfig, UserSession } from "@stacks/connect";
import { Connect } from "@stacks/connect-react";
import { Container, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";

import Header from "../components/header";
import NFTPreview from "../components/nftpreview";
import Authenticate from "../components/auth";
import ClaimNFT from "../components/claim";
import FAQ from "../components/faq";

import {
  claimNFT,
  isLoggedIn,
  isBroadcasted,
  getNFTCount,
} from "../lib/helpers";
import { APP_NAME, APP_LOGO, APP_WIDTH } from "../lib/constants";

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
    setClaimed(await isBroadcasted(user));
    setIsLoading(false);
  }, [userSession]);

  // check how many NFTs are minted
  useEffect(async () => {
    setIsLoading(true);
    setCount(
      await getNFTCount(user, (err) => {
        console.log(err);
        toast({
          title: "Could not load NFT count",
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
      icon: `/${APP_LOGO}`,
    },
  };

  return (
    <Connect authOptions={authOptions}>
      <Container maxW={APP_WIDTH} p="2">
        <Head>
          <title>{APP_NAME}</title>
        </Head>

        <Header />
        <NFTPreview claimed={claimed} count={count} />
        {renderCTA()}
        <FAQ />
      </Container>
    </Connect>
  );

  function renderCTA() {
    // if not signed in
    if (!isLoggedIn(user)) {
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
    if (isLoggedIn(user) && !claimed && tx === "") {
      return <ClaimNFT enabled={enabled} />;
    }
    // TODO: if signed in, not claimed, transaction pending
  }
}

async function claimToken() {
  setIsLoading(true);
  await claimNFT((data) => {
    console.log("Transaction ID:", data.txId);
    console.log("Raw transaction:", data.txRaw);

    setTx(data.txId);
    setIsLoading(false);
  });
}
