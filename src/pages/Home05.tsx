import React, { useMemo } from 'react';
import HeaderStyle2 from '../components/header/HeaderStyle2';
import * as anchor from "@project-serum/anchor";
import { clusterApiUrl } from "@solana/web3.js";
import Footer from '../components/footer/Footer';
import SliderStyle2 from '../components/slider/SliderStyle2';
import MeetTheTeam from '../components/layouts/home-5/MeetTheTeam';
import Slider from '../components/slider/Slider';
import heroSliderData from '../assets/content-data/heroSliderData';
import RarityGridPageWrapper from '../components/layouts/explore-01/RarityGrid';
import Experiences from "../components/section/Experiences";
import todayPickData from '../assets/content-data/collectionexplorer';
import Workflow from '../components/layouts/home-5/Workflow'

//import { createTheme} from "@material-ui/core";

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

import {
    getPhantomWallet,
    // getSlopeWallet,
    // getSolflareWallet,
    // getSolflareWebWallet,
    // getSolletWallet,
    // getSolletExtensionWallet,
    // getSolongWallet,
    // getLedgerWallet,
    // getSafePalWallet,
} from "@solana/wallet-adapter-wallets";

import {
    WalletModalProvider,
    // WalletDisconnectButton,
    // WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

import { DEFAULT_TIMEOUT } from '../connection';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

const getCandyMachineId = (): anchor.web3.PublicKey | undefined => {
    try {
        const candyMachineId = new anchor.web3.PublicKey(
            process.env.REACT_APP_CANDY_MACHINE_ID!,
        );

        return candyMachineId;
    } catch (e) {
        console.log('Failed to construct CandyMachineId', e);
        return undefined;
    }
};

const candyMachineId = getCandyMachineId();
  
const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;

const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(
    rpcHost ? rpcHost : anchor.web3.clusterApiUrl('mainnet-beta'),
);

// const theme = createTheme({
//       palette: {
//           type: 'dark',
//       },
//       overrides: {
//           MuiButtonBase: {
//               root: {
//                   justifyContent: 'flex-start',
//               },
//           },
//           MuiButton: {
//               root: {
//                   textTransform: undefined,
//                   padding: '12px 16px',
//                   color: '#5142fc'
//               },
//               startIcon: {
//                   marginRight: 8,
//               },
//               endIcon: {
//                   marginLeft: 8,
//               },
//           },
//       },
//   });

const Home05 = () => {

    // Custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), []);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded.

    const wallets = useMemo(
        () => [
            getPhantomWallet(),
        ],
        []
    );

    return (
        <div className='home-5'>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <HeaderStyle2
                                candyMachineId={candyMachineId}
                                connection={connection}
                                txTimeout={DEFAULT_TIMEOUT}
                                rpcHost={rpcHost}
                                network={network}
                            />
                        <SliderStyle2 
                            //@ts-ignore
                            data={heroSliderData}
                            candyMachineId={candyMachineId}
                            connection={connection}
                            txTimeout={DEFAULT_TIMEOUT}
                            rpcHost={rpcHost}
                            network={network}
                        />
                        <RarityGridPageWrapper data={todayPickData} />
                        <Slider data={heroSliderData} />
                        <Workflow />
                        <Experiences/>
                        <MeetTheTeam />
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
            <Footer />
        </div>
    );
}

export default Home05;
