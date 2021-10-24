import React from 'react';
import { useAtom } from 'jotai'; 
import { is_mobile, is_safari_desktop } from '@hooks/nft_panel_state';
import { MobileInfo } from '@components/mobile_info'
import { DownloadWallet } from '@components/download_wallet';
import { ConnectWallet } from '@components/connect_wallet';
import { ClaimPanel } from '@components/claim_panel';
import { FinishedPanel } from '@components/finished_panel';
import { nftClaimedAtom } from '@store/tx-state'; 
import { userAtom } from '@store/auth';

export const InstructionPanel = props => {
    const isMobile = is_mobile();
    const isSafariDesktop = is_safari_desktop(); 
    // TODO
    const isDownloaded = true; 
    const [user] = useAtom(userAtom)
    const isUserSignedIn = !!user;
    const [nftClaimed] = useAtom(nftClaimedAtom)

    let instructionPanel; 
    if (isMobile) {
        instructionPanel = <MobileInfo />
    } else if (!isDownloaded) {
        instructionPanel = <DownloadWallet isSafariDesktop={isSafariDesktop} />
    } else if (!isUserSignedIn) {
        instructionPanel = <ConnectWallet />
    } else if (nftClaimed) {
        instructionPanel = <FinishedPanel />
    } else {
        instructionPanel = <ClaimPanel />
    }

    return (
        instructionPanel
    )
}