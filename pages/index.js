import React from 'react';
import Head from 'next/head';
import { MicroStacksProvider, useUser } from 'micro-stacks/react';
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

import { isLoggedIn, getNetwork, getNetworkPrincipal } from '../lib/helpers';
import {
  APP_NAME,
  APP_LOGO,
  APP_WIDTH,
  CONTRACT_ID,
  CONTRACT_CLAIM_METHOD,
} from '../lib/constants';
import { nftCountQuery, useNftClaimed, useNftCount, useNftCountEnabled } from '../lib/store';

function Home() {
  const user = useUser();
  const [tx, setTx] = useState('');
  const [claimed] = useNftClaimed();
  const [count] = useNftCount();
  const [isLoading, setIsLoading] = useState(true);
  const [enabled] = useNftCountEnabled(false);

  const claimOptions = {
    contractAddress: getNetworkPrincipal(),
    contractName: CONTRACT_ID,
    functionName: CONTRACT_CLAIM_METHOD,
    functionArgs: [],
    network: getNetwork(),
    onFinish: data => {
      // success
      console.log('Transaction ID:', data.txId);
      console.log('Raw transaction:', data.txRaw);

      setTx(data.txId);
      setIsLoading(false);
    },
    onCancel: () => {
      setIsLoading(false);
    },
  };

  return (
    <Container maxW={APP_WIDTH} minW={APP_WIDTH} p="2">
      <Head>
        <title>{APP_NAME}</title>
      </Head>
      <Header />
      <NFTPreview claimed={claimed || tx.length > 0} count={count} />
      {isNaN(count) && <SkeletonView />}
      {isMobile && <MobileNote />}
      {!isMobile && !isNaN(count) && renderCTA()}
      {!isNaN(count) && enabled && !claimed && tx.length === 0 && <FAQ />}
    </Container>
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
      <Home />
    </MicroStacksProvider>
  );
}
