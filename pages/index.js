import React from 'react';
import Head from 'next/head';
import { MicroStacksProvider, useUserData, useAuth } from 'micro-stacks/react';
import { Container } from '@chakra-ui/react';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { getServerSideQueryProps } from 'jotai-query-toolkit/nextjs';
import Header from '../components/header';
import SkeletonView from '../components/skeletonview';
import MobileNote from '../components/mobilenote';
import NFTPreview from '../components/nftpreview';
import Authenticate from '../components/auth';
import ClaimNFT from '../components/claim';
import ClaimSuccess from '../components/claimsuccess';
import ClaimDisabled from '../components/claimdisabled';
import FAQ from '../components/faq';

import { getNetwork, getNetworkPrincipal } from '../lib/helpers';
import {
  APP_NAME,
  APP_LOGO,
  APP_WIDTH,
  CONTRACT_ID,
  CONTRACT_CLAIM_METHOD,
} from '../lib/constants';
import { nftCountQuery, useNftClaimed, useNftCount, useNftCountEnabled } from '../lib/store';
import { SafeSuspense } from '../components/safe-suspense';

function Home() {
  const { isSignedIn } = useAuth();
  const user = useUserData();
  const [claimed, setClaimed] = useNftClaimed();
  const [count] = useNftCount();
  const [enabled] = useNftCountEnabled(false);

  const claimOptions = {
    contractAddress: getNetworkPrincipal(),
    contractName: CONTRACT_ID,
    functionName: CONTRACT_CLAIM_METHOD,
    functionArgs: [],
    network: getNetwork(),
    onFinish: data => {
      setClaimed(true);
    },
  };

  console.log(isSignedIn, claimed, !isMobile, count);

  return (
    <>
      <NFTPreview claimed={claimed} count={count} />
      {isMobile ? <MobileNote /> : renderCTA()}
      {enabled && !claimed && <FAQ />}
    </>
  );

  function renderCTA() {
    if (!enabled) return <ClaimDisabled />;
    // if not signed in
    else if (!isSignedIn) return <Authenticate />;
    // if signed in, not claimed, no transaction
    else if (isSignedIn && !claimed) {
      return <ClaimNFT enabled={enabled} claimOptions={claimOptions} />;
    }
    // if signed in and claimed or transaction pending
    else if (isSignedIn && claimed) {
      return <ClaimSuccess user={user} />;
    }
  }
}

export const getServerSideProps = getServerSideQueryProps([nftCountQuery])();

export default function HomePage() {
  /** @type {import('micro-stacks/react').MicroStacksProvider} */
  return (
    <MicroStacksProvider
      authOptions={{
        appDetails: {
          name: APP_NAME,
          icon: `${typeof window !== 'undefined' ? window.location.href : ''}/${APP_LOGO}`,
        },
      }}
    >
      <Container maxW={APP_WIDTH} minW={APP_WIDTH} p="2">
        <Head>
          <title>{APP_NAME}</title>
        </Head>
        <Header />
        <SafeSuspense
          // this suspense boundary and fallback should really be lower in the tree, ideally wrapping _only_ the components that have any async atoms
          fallback={
            <>
              <NFTPreview claimed={false} count={0} />
              <SkeletonView />
            </>
          }
        >
          <Home />
        </SafeSuspense>
      </Container>
    </MicroStacksProvider>
  );
}
