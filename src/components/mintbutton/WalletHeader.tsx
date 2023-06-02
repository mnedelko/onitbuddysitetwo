import { createTheme, ThemeProvider } from "@material-ui/core";
import React, { FC, useMemo } from 'react';
import { Link } from "react-router-dom";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

import HeaderStyle2 from '../header/HeaderStyle2';

import {
    getPhantomWallet,
    getSlopeWallet,
    getSolflareWallet,
    getSolflareWebWallet,
    getSolletWallet,
    getSolletExtensionWallet,
    getSolongWallet,
    getLedgerWallet,
    getSafePalWallet,
} from "@solana/wallet-adapter-wallets";
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

import * as anchor from "@project-serum/anchor";
import { clusterApiUrl } from "@solana/web3.js";

import { DEFAULT_TIMEOUT } from '../../connection';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

const candyMachineId = new anchor.web3.PublicKey(
    process.env.REACT_APP_CANDY_MACHINE_ID!
  );
  
  const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;
  
  const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
  const connection = new anchor.web3.Connection(rpcHost);
  
  const txTimeout = 30000; // milliseconds (confirm this works for your project)
  
  const theme = createTheme({
      palette: {
          type: 'dark',
      },
      overrides: {
          MuiButtonBase: {
              root: {
                  justifyContent: 'flex-start',
              },
          },
          MuiButton: {
              root: {
                  textTransform: undefined,
                  padding: '12px 16px',
              },
              startIcon: {
                  marginRight: 8,
              },
              endIcon: {
                  marginLeft: 8,
              },
          },
      },
  });

  const ConnectWalletHeader = () => {
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
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default ConnectWalletHeader;

