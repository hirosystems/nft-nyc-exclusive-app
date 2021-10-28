import { getNFTCount, isBroadcasted } from './helpers';
import { atomFamilyWithQuery, atomWithQuery, useQueryAtom } from 'jotai-query-toolkit';
import { atom, useAtom } from 'jotai';
import { userDataAtom } from 'micro-stacks/react';
import { MAX_TOKEN_AMOUNT } from './constants';

export const nftCountState = atomWithQuery('getNFTCount', getNFTCount);
export const nftCountQuery = ['getNFTCount', getNFTCount];

export const nftClaimedFamilyState = atomFamilyWithQuery('nftClaimed', (_get, user) => {
  return isBroadcasted(user);
});

export const nftClaimedState = atom(get => {
  const user = get(userDataAtom);
  if (!user) return;
  return get(nftClaimedFamilyState(user));
});

export const nftCountEnabledState = atom(get => {
  const count = get(nftCountState);
  return count < MAX_TOKEN_AMOUNT;
});

export const useNftCountEnabled = () => useAtom(nftCountEnabledState);
export const useNftClaimed = () => useAtom(nftClaimedState);
export const useNftCount = () => useQueryAtom(nftCountState);
