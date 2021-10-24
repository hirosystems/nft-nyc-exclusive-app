import { atom } from 'jotai';
import { Configuration, AccountsApi } from '@stacks/blockchain-api-client';
import { StacksMainnet, StacksMocknet } from "@stacks/network";

export const networkAtom = atom(() => {
    let network;
    if (process.env.NODE_ENV === "development") {
        network = new StacksMocknet();
        network.coreApiUrl = "http://localhost:3999";
    } else {
        network = new StacksMainnet();
        network.coreApiUrl = "https://stacks-node-api.mainnet.stacks.co";
    } 
    return network 
});

const configAtom = atom(get => {
    const network = get(networkAtom); 
    return new Configuration({
        fetchApi: fetch,
        basePath: network.coreApiUrl,
    })
});

export const accountClientsAtom = atom(get => {
    const config = get(configAtom); 
    return new AccountsApi(config)
});