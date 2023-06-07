import React, { useMemo } from 'react';
import HeaderStyle2 from '../components/header/HeaderStyle2';
import * as anchor from "@project-serum/anchor";

import { DEFAULT_TIMEOUT } from "../connection";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    ConnectionProvider,
    WalletProvider,
  } from "@solana/wallet-adapter-react";
import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";

import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SlopeWalletAdapter } from "@solana/wallet-adapter-slope";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";  
import {
    SolletWalletAdapter,
    SolletExtensionWalletAdapter,
  } from "@solana/wallet-adapter-sollet";

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

// import {
//     WalletModalProvider,
//     // WalletDisconnectButton,
//     // WalletMultiButton
// } from '@solana/wallet-adapter-react-ui';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

const getCandyMachineId = (): anchor.web3.PublicKey | undefined => {
    try {
      return new anchor.web3.PublicKey(process.env.REACT_APP_CANDY_MACHINE_ID!);
    } catch (e) {
      console.log("Failed to construct CandyMachineId", e);
      return undefined;
    }
  };
  
  let error: string | undefined = undefined;
  
  if (process.env.REACT_APP_SOLANA_NETWORK === undefined) {
    error =
      "Your REACT_APP_SOLANA_NETWORK value in the .env file doesn't look right! The options are devnet and mainnet-beta!";
  } else if (process.env.REACT_APP_SOLANA_RPC_HOST === undefined) {
    error =
      "Your REACT_APP_SOLANA_RPC_HOST value in the .env file doesn't look right! Make sure you enter it in as a plain-text url (i.e., https://metaplex.devnet.rpcpool.com/)";
  }
  
  const candyMachineId = getCandyMachineId();
  const network = (process.env.REACT_APP_SOLANA_NETWORK ??
    "mainnet-beta") as WalletAdapterNetwork;
  const rpcHost =
    process.env.REACT_APP_SOLANA_RPC_HOST ?? anchor.web3.clusterApiUrl("devnet");
  const connection = new anchor.web3.Connection(rpcHost);

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

  const endpoint = useMemo(() => clusterApiUrl(network), []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new SlopeWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    []
  );

    return (
        <div className='home-5'>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletDialogProvider>
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
                    </WalletDialogProvider>
                </WalletProvider>
            </ConnectionProvider>
            <Footer />
        </div>
    );
}

export default Home05;
