import { atom, useAtom } from 'jotai';
import { atomWithDefault } from 'jotai/utils';
import { AppConfig, UserSession } from '@stacks/auth';
import {
    showConnect,
  } from "@stacks/connect";

export const appConfig = (typeof window === 'object')  ? new AppConfig(['store_write', 'publish_data'],  document.location.href) : new AppConfig(['store_write', 'publish_data']); 
export const userSessionAtom = atom(() => new UserSession({appConfig}));

// UserData | undefined
export const userAtom = atomWithDefault(get => {
    const userSession = get(userSessionAtom); 
    if (userSession.isUserSignedIn()) {
        return userSession.loadUserData();
    }
}); 

export function authenticate() {
    const [userSession] = useAtom(userSessionAtom); 
    showConnect({
      appDetails: {
        name: "Exclusive Bitcoin NFT for NFT.NYC",
        icon: window.location.origin + "/hiro-icon-black.png",
      },
      redirectTo: "/",
    //   finished: () => {
    //     window.location.reload();
    //   },
      userSession: userSession,
    });
  }