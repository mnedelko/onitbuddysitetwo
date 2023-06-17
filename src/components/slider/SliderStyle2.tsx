import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as anchor from "@project-serum/anchor";
//import { Link } from 'react-router-dom'

import { Navigation, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import 'swiper/components/navigation';
import 'swiper/components/pagination';


//style imports

import styled from "styled-components";
import confetti from "canvas-confetti";
import { Paper, LinearProgress, Chip } from "@material-ui/core";

//static file imports
import shape from '../../assets/images/backgroup-secsion/bg_section_onit.png';
import tick from '../../assets/images/icon/tick.png';
import cross from '../../assets/images/icon/cross.png';
import discount from '../../assets/images/icon/discount.png';
import imgdetail1 from '../../assets/images/previewgif/mintinggifonitbuddy.gif';

//solana imports
import {
    Commitment,
    Connection,
    PublicKey,
    Transaction,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";
import {WalletAdapterNetwork} from '@solana/wallet-adapter-base';
import { SolanaMobileWalletAdapterWalletName } from "@solana-mobile/wallet-adapter-mobile";


import {useAnchorWallet, useWallet} from "@solana/wallet-adapter-react";
import {WalletModalProvider, WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import {GatewayProvider} from '@civic/solana-gateway-react';
import Countdown from "react-countdown";

import {AlertState, getAtaForMint, toDate} from '../../utility/utils';
import {MintButton} from '../../MintButton';
import {
    awaitTransactionSignatureConfirmation,
    CANDY_MACHINE_PROGRAM,
    CandyMachineAccount,
    createAccountsForMint,
    getCandyMachineState, 
    getCollectionPDA,
    mintOneToken,
    SetupState,
} from "../../candy-machine";

//component imports
import Card from '../elements/Card'
//import { getWalletAdapters } from '@solana/wallet-adapter-wallets';
// import { AnyRecord } from 'dns';
// import { stringify } from 'querystring';

//@ts-ignore
import lightpaperpdfslider from '../../assets/docs/OnitBuddy-LightPaper.pdf';
import { set } from '@project-serum/anchor/dist/cjs/utils/features';

const decimals = process.env.REACT_APP_SPL_TOKEN_TO_MINT_DECIMALS ? +process.env.REACT_APP_SPL_TOKEN_TO_MINT_DECIMALS!.toString() : 9;
const splTokenName = process.env.REACT_APP_SPL_TOKEN_TO_MINT_NAME ? process.env.REACT_APP_SPL_TOKEN_TO_MINT_NAME.toString() : "TOKEN";

const WalletContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const WalletAmount = styled.div`
  color: white;
  width: auto;
  padding: 5px 5px 5px 16px;
  min-width: 48px;
  min-height: auto;
  border-radius: 22px;
  background-color: var(--main-text-color);
  box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%);
  box-sizing: border-box;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  font-weight: 500;
  line-height: 1.75;
  text-transform: uppercase;
  border: 0;
  margin: 0;
  display: inline-flex;
  outline: 0;
  position: relative;
  align-items: center;
  user-select: none;
  vertical-align: middle;
  justify-content: flex-start;
  gap: 10px;
`;

//styles
const Wallet = styled.ul`
  flex: 0 0 auto;
  margin: 0;
  padding: 0;
`;

const ConnectButton:any = styled(WalletModalProvider)`
  border-radius: 5px !important;
  padding: 6px 16px;
  background-color: #4E44CE;
  margin: 0 auto;
`;

// const LogoAligner = styled.div`
//   display: flex;
//   align-items: center;

//   img {
//     max-height: 35px;
//     margin-right: 10px;
//   }
// `;

const NFT = styled(Paper)`
  color: white !important;
  min-width: 500px;
  padding: 5px 20px 20px 20px;
  flex: 1 1 auto;
  background-color: var(--card-background-color) !important;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22) !important;

  @media (max-width: 575px) {
    padding: 5px 5px 5px 5px;
  };
`;


const MintButtonContainer:any = styled.div`
  button.MuiButton-contained:not(.MuiButton-containedPrimary).Mui-disabled {
    color: #5142fc;
  }
  button.MuiButton-contained:not(.MuiButton-containedPrimary):hover,
  button.MuiButton-contained:not(.MuiButton-containedPrimary):focus {
    -webkit-animation: pulse 1s;
    animation: pulse 1s;
    box-shadow: 0 0 0 2em rgba(255, 255, 255, 0);
  }
  @-webkit-keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 #ef8f6e;
    }
  }
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 #ef8f6e;
    }
  }

  justify-content: center;

  @media (max-width: 575px) {
    flex: 1 1 auto;
    justify-content: center;
    h1{
    font-size: 30px !important;
    };
};
`;

// const GoldTitle = styled.h2`
//   color: var(--title-text-color);
// `;

// const Des = styled(NFT)`
//   text-align: left;
//   padding-top: 0px;
//   max-width: 500px;
// `;

const SolExplorerLink = styled.a`
  color: var(--title-text-color);
  border-bottom: 1px solid var(--title-text-color);
  font-weight: bold;
  list-style-image: none;
  list-style-position: outside;
  list-style-type: none;
  outline: none;
  text-decoration: none;
  text-size-adjust: 100%;
  :hover {
    border-bottom: 2px solid var(--title-text-color);
  }
`;

const MainContainer = styled.div`
  color: white !important;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: 4%;
  margin-left: 4%;
  text-align: center;
  justify-content: center;
  @media (max-width: 575px) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-right: 0;
    margin-left: 0;
  };
`;

const MintContainer = styled.div`
display: flex;
flex-direction: row;
flex: 1 1 auto;
flex-wrap: wrap;
gap: 20px;
@media (max-width: 575px) {
    gap: 0px;
    justify-content: center;
  };

`;

// const DesContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   flex: 1 1 auto;
//   gap: 20px;
// `;

const Price = styled(Chip)`
  position: absolute;
  display: block;
  transform: translate(-50%);
  margin: 5px;
  font-weight: bold;
  font-size: 1.2em !important;
  font-family: 'Patrick Hand', cursive !important;
`;

// const Image = styled.img`
//   height: 400px;
//   width: auto;
//   border-radius: 7px;
//   box-shadow: 5px 5px 40px 5px rgba(0,0,0,0.5);
// `;

const BorderLinearProgress = styled(LinearProgress)`
  margin: 20px;
  height: 10px !important;
  border-radius: 30px;
  border: 2px solid white;
  box-shadow: 5px 5px 40px 5px rgba(0,0,0,0.5);
  background-color:var(--main-text-color) !important;
  
  > div.MuiLinearProgress-barColorPrimary{
    background-color:var(--title-text-color) !important;
  }
  > div.MuiLinearProgress-bar1Determinate {
    border-radius: 30px !important;
    background-image: linear-gradient(270deg, rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.5));
  }
  @media (max-width: 575px) {
    justify-content: center;
  };
`;

// const WalletAmount2 = styled.div`
//   color: white;
//   width: auto;
//   padding: 5px 5px 5px 16px;
//   min-width: 48px;
//   min-height: auto;
//   font-weight: 500;
//   line-height: 1.75;
//   text-transform: uppercase;
//   margin: 0;
//   display: inline-flex;
//   outline: 0;
//   position: relative;
//   align-items: center;
//   user-select: none;
//   vertical-align: middle;
//   justify-content: flex-start;
//   gap: 10px;
// `;

const ConnectSliderButton : any = styled(WalletMultiButton)`
    font-weight       : 700;
    font-size         : 14px;
    line-height       : 22px;
    margin-left       : 20px;
    position          : relative;
    -webkit-transition: all 0.3s ease;
    -moz-transition   : all 0.3s ease;
    -ms-transition    : all 0.3s ease;
    -o-transition     : all 0.3s ease;
    transition        : all 0.3s ease;
`;


//interface
export interface SliderProps {
    candyMachineId?: anchor.web3.PublicKey;
    connection: anchor.web3.Connection;
    txTimeout: number;
    rpcHost: string;
    network: WalletAdapterNetwork;
    error?: string;
}

const SliderStyle2 = (props: SliderProps) => {
    const [isUserMinting, setIsUserMinting] = useState(false);
    const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
    const [alertState, setAlertState] = useState<AlertState>({
        open: false,
        message: "",
        severity: undefined,
    });
    const [isActive, setIsActive] = useState(false); // true when countdown completes or whitelisted
    const [endDate, setEndDate] = useState<Date>();
    const [itemsRemaining, setItemsRemaining] = useState<number>();
    const [isWhitelistUser, setIsWhitelistUser] = useState(false);
    const [isPresale, setIsPresale] = useState(false);
    const [isValidBalance, setIsValidBalance] = useState(false);
    const [discountPrice, setDiscountPrice] = useState<Number>();
    const [needTxnSplit, setNeedTxnSplit] = useState(true);
    const [setupTxn, setSetupTxn] = useState<SetupState>();

    const rpcUrl = props.rpcHost;
    const anchorWallet = useAnchorWallet();
    const { connect, connected, publicKey, wallet } = useWallet();
    console.log("lets check if the wallet gets called", wallet);
    const cluster = props.network;

    const [balance, setBalance] = useState<number>();
    const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT
    
    const [solanaExplorerLink, setSolanaExplorerLink] = useState<string>("");
    const [itemsAvailable, setItemsAvailable] = useState<number>();
    const [itemsRedeemed, setItemsRedeemed] = useState<number>();
    
    const [isSoldOut, setIsSoldOut] = useState(false);
    const [payWithSplToken, setPayWithSplToken] = useState(false);
    const [price, setPrice] = useState(0);
    const [priceLabel, setPriceLabel] = useState<string>("SOL");
    const [whitelistPrice, setWhitelistPrice] = useState(0);
    const [whitelistEnabled, setWhitelistEnabled] = useState(false);
    //const [isBurnToken, setIsBurnToken] = useState(false);
    const [whitelistTokenBalance, setWhitelistTokenBalance] = useState(0);
    const [isEnded, setIsEnded] = useState(false);
    
    
    const [isWLOnly, setIsWLOnly] = useState(false);
    const [priceDiscount, setPriceDiscount] = useState(0);
    const [userPrice, setUserPrice] = useState<Number>();
    const [solBalance, setSolBalance] = useState<Number>();
    const solFeesEstimation = 0.012; // approx of account creation fees

    //Logging:
    // function consoleThis(): any {
    //     console.log("these are the variables");
    //     console.log('balance' + ' ' + balance);
    //     console.log('isMinting' + ' ' + isMinting);
    //     console.log('isActive' + ' ' + isActive);
    //     console.log('GoLiveDate' + ' '+ toDate(candyMachine?.state.goLiveDate))
    //     console.log('solanaExplorerLink' + ' ' + solanaExplorerLink);
    //     console.log('itemsAvailable' + ' ' + itemsAvailable); 
    //     console.log('itemsRedeemed' + ' ' + itemsRedeemed);
    //     console.log('itemsRemaining' + ' ' + itemsRemaining);
    //     console.log('isSoldOut' + ' ' + isSoldOut);
    //     console.log('payWithSplToken' + ' ' + payWithSplToken);
    //     console.log('price' + ' ' + price );
    //     console.log('priceLabel' + ' ' + priceLabel);
    //     console.log('whitelistPrice' + ' ' + whitelistPrice);
    //     console.log('whitelistEnabled' + ' ' + whitelistEnabled );
    //     console.log('isBurnToken' + ' ' + JSON.stringify(isBurnToken));
    //     console.log('whitelistTokenBalance' + ' ' + whitelistTokenBalance);
    //     console.log('isEnded' + ' ' + isEnded );
    //     console.log('endDate' + ' ' + endDate);
    //     console.log('isPresale' + ' ' + isPresale);
    //     console.log('isWLOnly' + ' ' + isWLOnly );
    //     console.log('alertState' + ' ' + JSON.stringify(alertState));
    //     console.log('rpcUrl' + ' ' + rpcUrl);
    // }

    //State Definitions for the Slider Contents
    const [data] = useState(
        [
            {
                subtitle: 'HAND-CRAFTED COLLECTION OF',
                title: '8080 UNIQUE NFTs',
                description: 'With the goal to deliver the world\'s first transmograble NFTs based on an open-source, community-driven design system.'
            }
        ]
    )
    
    const refreshCandyMachineState = useCallback(
        async (commitment: Commitment = "confirmed") => {
            if (!publicKey) { 
                return;
            }
            if (props.error !== undefined){
                setAlertState({
                    open:true,
                    message: props.error,
                    severity: "error",
                    hideDuration: null,
                });
                return;
            }

    const connection = new Connection(props.rpcHost, commitment);

    if (props.candyMachineId){
        try {
            const cndy = await getCandyMachineState(
                anchorWallet as anchor.Wallet,
                props.candyMachineId,
                connection
            );
            console.log("Candy machine state: ", cndy);
            let active = cndy?.state.goLiveDate
                ? cndy?.state.goLiveDate.toNumber() < new Date().getTime() / 1000
                : false;
            let presale = false;

            // duplication of state to make sure we have the right values!
            let isWLUser = false;
            let userPrice = cndy.state.price;
            setUserPrice(userPrice.toNumber() / LAMPORTS_PER_SOL);

            //This is where we are setting the candymachine attributes
            //setCandyMachine(cndy);
            console.log("this is the candymachine payload", cndy);
            setItemsAvailable(cndy.state.itemsAvailable);
            setItemsRemaining(cndy.state.itemsRemaining);
            setItemsRedeemed(cndy.state.itemsRedeemed);

            //this is where we are implementing the decimals
            // var divider = 1;
            // if (decimals) {
            //     divider = +('1' + new Array(decimals).join('0').slice() + '0');
            // }

            //whitelist mint?

            if (cndy?.state.whitelistMintSettings){
                setWhitelistEnabled(true);
                // is it a presale mint?
                if(
                    cndy.state.whitelistMintSettings.presale &&
                    (!cndy.state.goLiveDate ||
                        cndy.state.goLiveDate.toNumber() > new Date().getTime() / 1000)
                ) {
                    presale = true;
                }
                // is there a discount?
                if (cndy.state.whitelistMintSettings.discountPrice) {
                    setDiscountPrice(cndy.state.whitelistMintSettings.discountPrice.toNumber()/LAMPORTS_PER_SOL);
                    //userPrice = cndy.state.whitelistMintSettings.discountPrice;
                    setUserPrice(cndy.state.price.toNumber() / LAMPORTS_PER_SOL);
                } else {
                    setDiscountPrice(undefined);
                    // when presale=false and discountPrice=null, mint is restricted
                    // to whitelist users only
                    if (!cndy.state.whitelistMintSettings.presale) {
                        cndy.state.isWhitelistOnly = true;
                    }
                }
                // retrieves the whitelist token
                const mint = new anchor.web3.PublicKey(
                    cndy.state.whitelistMintSettings.mint
                );
                console.log("mint", mint)
                const token = (await getAtaForMint(mint, publicKey))[0];
                console.log("token", token)

                try{
                    const whitelistTokBalance = await connection.getTokenAccountBalance(token);
                    setWhitelistTokenBalance(whitelistTokBalance.value.uiAmount);
                    console.log("This is the whitelist token balance", whitelistTokBalance);
                    isWLUser = whitelistTokBalance.value.uiAmount > 0;
                    // only whitelist the user if the balance > 0
                    console.log("isWLUser", isWLUser);
                    setIsWhitelistUser(isWLUser);

                    if(cndy.state.isWhitelistOnly) {
                        active = isWLUser && (presale || active);
                    }
                } catch (e) {
                    setIsWhitelistUser(false);
                    // no whitelist user, no mint
                    if (cndy.state.isWhitelistOnly) {
                        active = false;
                    }
                    console.log(
                        "There was a problem fetching whitelist token balance"
                    );
                    console.log(e);
                }
            }
            userPrice = isWLUser ? userPrice : cndy.state.price;
            setUserPrice(cndy.state.price.toNumber()/ LAMPORTS_PER_SOL);

            // detect if using spl-token to mint
            if (cndy?.state.tokenMint) {
                console.log("Entering state.tokenMint");
                // retrieves teh SPL token
                const mint = new anchor.web3.PublicKey(cndy.state.tokenMint);
                const token = (await getAtaForMint(mint, publicKey))[0];
                try {
                    const balance = await connection.getTokenAccountBalance(token);

                    const valid = new anchor.BN(balance.value.amount).gte(userPrice);

                    //only allow user to mint if token balance > the user if the balance > 0
                    setIsValidBalance(valid);
                    active = active && valid;
                } catch(e) {
                    setIsValidBalance(false);
                    active = false;
                    //no whitelist user, no mint
                    console.log("There was a problem fetching SPL token balance");
                    console.log(e);
                }
            } else {
                console.log("No state.tokenMind");
                const balance = new anchor.BN(
                    await connection.getBalance(publicKey)
                );
                setBalance(balance.toNumber());
                console.log("This is the publicKey", publicKey);
                console.log("balance", balance); 
                const valid = balance.gte(userPrice);
                setIsValidBalance(valid);
                active = active && valid;
            };

            // datetime to stop the mint?
            if (cndy?.state.endSettings?.endSettingType.date){
                setEndDate(toDate(cndy.state.endSettings.number));
                if(
                    cndy.state.endSettings.number.toNumber() <
                    new Date().getTime() / 1000
                ) {
                    active = false;
                }
            }
            //amount to stop the mint?
            console.log("cndy?.state.endSettings?.endSettingType.amount",cndy?.state.endSettings?.endSettingType.amount)
            if (cndy?.state.endSettings?.endSettingType.amount){
                console.log("endSettings.number",cndy.state.endSettings.number.toNumber());
                console.log("itemsAvailable",cndy.state.itemsAvailable);
                const limit = Math.min(
                    cndy.state.endSettings.number.toNumber(),
                    cndy.state.itemsAvailable
                );
                if (cndy.state.itemsRedeemed < limit) {
                    setItemsRemaining(limit - cndy.state.itemsRedeemed);
                } else {
                    setItemsRemaining(0);
                    cndy.state.isSoldOut = true;
                }
            } else {
                setItemsRemaining(cndy.state.itemsRemaining);
            }

            if (cndy.state.isSoldOut){
                active = false;
            }

            const [collectionPDA] = await getCollectionPDA(props.candyMachineId);
            const collectionPDAAccount = await connection.getAccountInfo(
                collectionPDA
            );

            setIsActive((cndy.state.isActive = active));
            setIsPresale((cndy.state.isPresale = presale));
            setCandyMachine(cndy);

            const txnEstimate = 
                892 +
                (!!collectionPDAAccount && cndy.state.retainAuthority ? 182 : 0) +
                (cndy.state.tokenMint ? 66 : 0) +
                (cndy.state.whitelistMintSettings ? 34 : 0) +
                (cndy.state.whitelistMintSettings?.mode?.burnEveryTime ? 34 : 0) +
                (cndy.state.gatekeeper ? 33 : 0) +
                (cndy.state.gatekeeper?.expireOnUse ? 66 : 0);

            setNeedTxnSplit(txnEstimate > 1230);
            } catch(e){
                if (e instanceof Error) {
                    if (
                        e.message === `Account does not exist ${props.candyMachineId}`
                    ) {
                        setAlertState({
                            open: true,
                            message: `Couldn't fetch candy machine state from candy machine with address: ${props.candyMachineId}, using rpc: ${props.rpcHost}! You probably typed the REACT_APP_CANDY_MACHINE_ID value wrong in your .env file, or you are using the wrong RPC!`,
                            severity: "error",
                            hideDuration: null,

                        });
                    } else if (
                        e.message.startsWith("failed to get info about account") 
                    ){
                        setAlertState({
                            open: true,
                            message: `Couldn't fetch candy machine state with rpc: ${props.rpcHost}! This probably means you have an issue with the REACT_APP_SOLANA_RPC_HOST value in your .env file, or you are not using a custom RPC!`,
                            severity: "error",
                            hideDuration: null,
                            });
                    }
                } else {
                    setAlertState({
                        open: true,
                        message: `${e}`,
                        severity: "error",
                        hideDuration: null,
                        });
                }
                console.log(e);
            } 
        } else {
            setAlertState({
                open: true,
                message: `Your REACT_APP_CANDY_MACHINE_ID value in the .env file doesn't look right! Make sure you enter it in as plain base-58 address!`,
                severity: "error",
                hideDuration: null,
                });
            }
    },
    [anchorWallet, props.candyMachineId, props.rpcHost, props.connection]
    );

    const onMint = async (
        beforeTransactions: Transaction[] = [],
        afterTransactions: Transaction[] = []
      ) => {
        try {
          setIsUserMinting(true);
          if (connected && candyMachine?.program && publicKey) {
            let setupMint: SetupState | undefined;
            if (needTxnSplit && setupTxn === undefined) {
              console.log("needTxnSplit", needTxnSplit, "setupTxn", setupTxn);
              setAlertState({
                open: true,
                message: "Please sign account setup transaction",
                severity: "info",
              });
              console.log("publicKey in On Mint", publicKey)
              setupMint = await createAccountsForMint(candyMachine, publicKey);
              console.log("setupMint",setupMint);
              let status: any = { err: true };
              console.log("status", status);
              console.log("props.connection in onMint", props.connection);
              if (setupMint.transaction) {
                status = await awaitTransactionSignatureConfirmation(
                  setupMint.transaction,
                  props.txTimeout,
                  props.connection,
                  true
                );
              }
              console.log("status in on Mint",status);
              if (status && !status.err) {
                setSetupTxn(setupMint);
                console.log("setupTxn", setupTxn);
                setAlertState({
                  open: true,
                  message:
                    "Setup transaction succeeded! Please sign minting transaction",
                  severity: "info",
                });
                console.log("Setup transaction succeeded! Please sign minting transaction")
              } else {
                setAlertState({
                  open: true,
                  message: "Mint failed! Please try again!",
                  severity: "error",
                });
                setIsUserMinting(false);
                console.log("Mint failed! Please try again!")
                return;
              }
            } else {
              setAlertState({
                open: true,
                message: "Please sign minting transaction",
                severity: "info",
              });
              console.log("Please sign minting transaction")
            }
            
            //we are progressing to here
            console.log("setupTxn in OnMint", setupTxn);
            const mintResult = await mintOneToken(
              candyMachine,
              publicKey,
              beforeTransactions,
              afterTransactions,
              setupMint ?? setupTxn
            );

            console.log("mintResult", mintResult)
    
            let status: any = { err: true };
            let metadataStatus = null;
            if (mintResult) {
              status = await awaitTransactionSignatureConfirmation(
                mintResult.mintTxId,
                props.txTimeout,
                props.connection,
                true
              );
    
              metadataStatus =
                await candyMachine.program.provider.connection.getAccountInfo(
                  mintResult.metadataKey,
                  "processed"
                );
              console.log("Metadata status: ", !!metadataStatus);
            }
    
            if (status && !status.err && metadataStatus) {
              // manual update since the refresh might not detect
              // the change immediately
              const remaining = itemsRemaining! - 1;
              setItemsRemaining(remaining);
              setIsActive((candyMachine.state.isActive = remaining > 0));
              candyMachine.state.isSoldOut = remaining === 0;
              setSetupTxn(undefined);
              setAlertState({
                open: true,
                message: "Congratulations! Mint succeeded!",
                severity: "success",
                hideDuration: 7000,
              });
              refreshCandyMachineState("processed");
            } else if (status && !status.err) {
              setAlertState({
                open: true,
                message:
                  "Mint likely failed! Anti-bot SOL 0.01 fee potentially charged! Check the explorer to confirm the mint failed and if so, make sure you are eligible to mint before trying again.",
                severity: "error",
                hideDuration: 8000,
              });
              refreshCandyMachineState();
            } else {
              setAlertState({
                open: true,
                message: "Mint failed! Please try again!",
                severity: "error",
              });
              refreshCandyMachineState();
            }
          }
        } catch (error: any) {
          let message = error.msg || "Minting failed! Please try again!";
          if (!error.msg) {
            if (!error.message) {
              message = "Transaction timeout! Please try again.";
            } else if (error.message.indexOf("0x137")) {
              console.log(error);
              message = `SOLD OUT!`;
            } else if (error.message.indexOf("0x135")) {
              message = `Insufficient funds to mint. Please fund your wallet.`;
            }
          } else {
            if (error.code === 311) {
              console.log(error);
              message = `SOLD OUT!`;
              window.location.reload();
            } else if (error.code === 312) {
              message = `Minting period hasn't started yet.`;
            }
          }
    
          setAlertState({
            open: true,
            message,
            severity: "error",
          });
          // updates the candy machine state to reflect the latest
          // information on chain
          refreshCandyMachineState();
        } finally {
          setIsUserMinting(false);
        }
      };
    
      const toggleMintButton = () => {
        let active = !isActive || isPresale;
    
        if (active) {
          if (candyMachine!.state.isWhitelistOnly && !isWhitelistUser) {
            active = false;
          }
          if (endDate && Date.now() >= endDate.getTime()) {
            active = false;
          }
        }
    
        if (
          isPresale &&
          candyMachine!.state.goLiveDate &&
          candyMachine!.state.goLiveDate.toNumber() <= new Date().getTime() / 1000
        ) {
          setIsPresale((candyMachine!.state.isPresale = false));
        }
    
        setIsActive((candyMachine!.state.isActive = active));
      };

    //   useEffect(() => {
    //     (async () => {
    //             if (anchorWallet) {
    //                 console.log(anchorWallet)
    //                 const solBalance = await props.connection.getBalance(anchorWallet!.publicKey);
    //                 setSolBalance(solBalance / LAMPORTS_PER_SOL);
    //             }
    //         })();
    //     }, [anchorWallet, props.connection]);
      
    //   useEffect(() => {
    //     (async () => {
    //         if (anchorWallet) {
    //             console.log(anchorWallet)
    //             const solBalance = await props.connection.getBalance(anchorWallet!.publicKey);
    //             setSolBalance(solBalance / LAMPORTS_PER_SOL);
    //         }
    //     })();
    //   }, [
    //     anchorWallet, props.connection,
    //   ]);

      useEffect(() => {
        refreshCandyMachineState();
      }, [
        anchorWallet,
        props.candyMachineId,
        props.connection,
        refreshCandyMachineState,
      ]);
      
    //   useEffect(() => {
    //     (function loop() {
    //       setTimeout(() => {
    //         refreshCandyMachineState();
    //         loop();
    //       }, 20000);
    //     })();
    //   }, [refreshCandyMachineState]);

    const renderGoLiveDateCounter = ({days, hours, minutes, seconds}: any) => {
        return (
            <div><Card elevation={1}><h1>{days}</h1>Days</Card><Card elevation={1}><h1>{hours}</h1>
                Hours</Card><Card elevation={1}><h1>{minutes}</h1>Mins</Card><Card elevation={1}>
                    <h1>{seconds}</h1>Secs</Card></div>
        );
    };

    //renders the EndDayCounter
    const renderEndDateCounter = ({days, hours, minutes}: any) => {
        let label = "";
        if (days > 0) {
            label += days + " days "
        }
        if (hours > 0) {
            label += hours + " hours "
        }
        label += (minutes + 1) + " minutes left to MINT."
        return (
            <div><h3>{label}</h3></div>
        );
    };

    //Displays success if the mint succeeded
    function displaySuccess(mintPublicKey: any, qty: number = 1): void {
        let remaining = itemsRemaining - qty;
        setItemsRemaining(remaining);
        setIsSoldOut(remaining === 0);
        // if (isBurnToken && whitelistTokenBalance && whitelistTokenBalance > 0) {
        //     let balance = whitelistTokenBalance - qty;
        //     setWhitelistTokenBalance(balance);
        //     setIsActive(isPresale && !isEnded && balance > 0);
        // }
        if ( whitelistTokenBalance && whitelistTokenBalance > 0) {
            let whitelistTokBalance = whitelistTokenBalance - qty;
            setWhitelistTokenBalance(whitelistTokBalance);
            setIsActive(isPresale && !isEnded && balance > 0);
        }
        setSetupTxn(undefined);
        setItemsRedeemed(itemsRedeemed + qty);
        if (!payWithSplToken && balance && balance > 0) {
            setBalance(balance - ((whitelistEnabled ? whitelistPrice : price) * qty) - solFeesEstimation);
        } //The below link is the link we can view the successful mint on via solscan
        setSolanaExplorerLink(cluster === "devnet" || cluster === "testnet"
            ? ("https://solscan.io/token/" + mintPublicKey + "?cluster=" + cluster)
            : ("https://solscan.io/token/" + mintPublicKey));
        setIsMinting(false);
        throwConfetti();
    };

    function throwConfetti(): void {
        confetti({
            particleCount: 400,
            spread: 70,
            origin: {y: 0.6},
        });
    }

    /* //This refreshes the candymachine state
    useEffect(() => {
        refreshCandyMachineState();
    }, [
        anchorWallet,
        props.candyMachineId,
        props.connection,
        isEnded,
        isPresale,
        refreshCandyMachineState
    ]); */
    
    return (
        <div>
            <section className="flat-title-page home5 mainslider">
                <img className="bg_h5" src={shape} alt="Axies" />
                {/* <div className="overlay">{consoleThis()}</div> */}
                <div className="swiper-container mainslider auctions">
                    <Swiper
                        //@ts-ignore
                        modules={[Navigation, Scrollbar, A11y]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev', 
                            disabledClass: 'disabled_swiper_button'}}
                        scrollbar={{ draggable: true }}
                    >
                        {
                        !anchorWallet ?
                            data.map((item, index) => (
                                <SwiperSlide key={index} >
                                    <SliderItem item={item}  />
                                </SwiperSlide>
                            ))
                            :
                            data.map((item, index) => (
                                <SwiperSlide key={index} >
                                    <SliderItem2 
                                        wallet = {wallet}
                                        publicKey = {publicKey}
                                        goLiveDate= {candyMachine?.state.goLiveDate}
                                        isGatekeeper = {candyMachine?.state.gatekeeper}
                                        //consoleThis ={consoleThis}
                                        anchorWallet = {anchorWallet}
                                        balance = {balance}
                                        cluster = {cluster}
                                        setBalance = {setBalance}
                                        isMinting = {isMinting}
                                        setIsMinting = {setIsMinting}
                                        isActive = {isActive}
                                        setIsActive = {setIsActive}
                                        solanaExplorerLink = {solanaExplorerLink} 
                                        setSolanaExplorerLink = {setSolanaExplorerLink}
                                        itemsAvailable = {itemsAvailable}
                                        setItemsAvailable ={setItemsAvailable}
                                        itemsRedeemed = {itemsRedeemed}
                                        setItemsRedeemed = {setItemsRedeemed}
                                        itemsRemaining = {itemsRemaining}
                                        setItemsRemaining = {setItemsRemaining}
                                        isSoldOut = {isSoldOut}
                                        setIsSoldOut = {setIsSoldOut}
                                        payWithSplToken = {payWithSplToken}
                                        setPayWithSplToken = {setPayWithSplToken}
                                        price = {price}
                                        setPrice = {setPrice}
                                        priceDiscount = {priceDiscount} //COMMENT: check this out
                                        setPriceDiscount = {setPriceDiscount} //COMMENT: check this out
                                        priceLabel = {priceLabel}
                                        setPriceLabel = {setPriceLabel}
                                        whitelistPrice = {whitelistPrice}
                                        setWhitelistPrice = {setWhitelistPrice}
                                        whitelistEnabled = {whitelistEnabled}
                                        setWhitelistEnabled = {setWhitelistEnabled}
                                        isWhitelistUser = {isWhitelistUser}
                                        setWhitelistUser = {setIsWhitelistUser}
                                        //isBurnToken = {isBurnToken}
                                        //setIsBurnToken = {setIsBurnToken}
                                        whitelistTokenBalance = {whitelistTokenBalance}
                                        setWhitelistTokenBalance = {setWhitelistTokenBalance}
                                        isEnded = {isEnded}
                                        setIsEnded = {setIsEnded}
                                        endDate = {endDate}
                                        setEndDate ={setEndDate}
                                        isPresale ={isPresale}
                                        setIsPresale = {setIsPresale}
                                        isWLOnly = {isWLOnly}
                                        setIsWLOnly = {setIsWLOnly}
                                        alertState = {alertState}
                                        setAlertState = {setAlertState}
                                        rpcUrl = {rpcUrl}
                                        renderGoLiveDateCounter = {renderGoLiveDateCounter}
                                        renderEndDateCounter = {renderEndDateCounter}
                                        candyMachine = {candyMachine}
                                        onMint = {onMint}
                                        isUserMinting = {isUserMinting}
                                        setIsUserMinting = {setIsUserMinting}
                                        isValidBalance = {isValidBalance}
                                        setIsValidBalance = {setIsValidBalance}
                                        userPrice = {userPrice}
                                        setUserPrice = {setUserPrice}
                                        discountPrice = {discountPrice}
                                        setDiscountPrice = {setDiscountPrice}
                                        setSolBalance = {setSolBalance}
                                        solBalance = {solBalance}
                                        connect = {connect}
                                    />
                                </SwiperSlide>
                            ))

                        }

                    </Swiper>
                </div>
            </section>
        </div>
    );
}

const SliderItem = (props: any) => (
    <div className="swiper-wrapper">
        <div className="swiper-slide">
            <div className="slider-item">
                <div className="themesflat-container">
                    <div className="wrap-heading flat-slider">
                        <div className="content">
                            <h4 className="mb-11"><span className="fill">{props.item.subtitle}</span></h4>
                            <h1 className="heading">{props.item.title}
                            </h1>
                            <p className="sub-heading mg-t-7 mg-bt-39">{props.item.description}
                            </p>
                        </div>
                        <div className="flat-bt-slider flex style2">
                            <a href="https://discord.gg/RWs3DP2" target="_blank" rel="noreferrer" className="sc-button header-slider style style-1 rocket fl-button pri-1"><span>Join the DAO
                            </span></a>
                            <a href={lightpaperpdfslider} target="_blank" rel="noreferrer" className="sc-button header-slider style style-1 note fl-button pri-1"><span>Light Paper
                            </span></a>
                            <ConnectSliderButton className="sc-button header-slider style style-1 fl-button pri-1" >
                                <span>Mint</span>
                            </ConnectSliderButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

)

//@ts-ignore
const SliderItem2 = (props: any) => {
    const wallet = props.wallet //<- needs a look!
    const publicKey = props.publicKey
    const anchorWallet = props.anchorWallet;
    const candyMachine = props.candyMachine;
    const rpcUrl = props.rpcUrl;
    const cluster = props.cluster;
    const isUserMinting = props.isUserMinting;
    const setIsUserMinting = props.setIsUserMinting;
    const isActive = props.isActive;
    const isPresale = props.isPresale;
    const isWhitelistUser = props.isWhitelistUser;
    const isValidBalance = props.isValidBalance;
    const whitelistEnabled = props.whitelistEnabled;
    const balance = props.balance;
    const userPrice = props.userPrice;
    const discountPrice = props.discountPrice;
    const solBalance = props.solBalance;
    const whitelistTokenBalance = props.whitelistTokenBalance; 
    
    console.log("1. Wallet", wallet);
    console.log("2. publicKey", publicKey);
    console.log("3. anchorWallet", anchorWallet);
    console.log("4. candyMachine", candyMachine);
    console.log("5. rpcUrl", rpcUrl);
    console.log("6. cluster", cluster);
    console.log("7. isUserMinting", isUserMinting);
    console.log("8. setIsUserMinting", setIsUserMinting);
    console.log("9. isActive", isActive);
    console.log("10. isPresale", isPresale);
    console.log("11. isWhitelistUser", isWhitelistUser);
    console.log("12. isValidBalance", isValidBalance);
    console.log("13. whitelistEnabled", whitelistEnabled);
    console.log("14. balance", balance);
    console.log("15. userPrice", userPrice);
    console.log("16. discountPrice", discountPrice);
    console.log("17. solBalance", solBalance);
    console.log("18. whitelistTokenBalance", whitelistTokenBalance); 
    
    return (
        <div className="swiper-wrapper">
            <div className="swiper-slide">
                <div className="slider-item">
                    <div className="tf-section2 tf-item-details">
                        <div className="themesflat-container">
                            <div className="row">
                                <div className="col-xl-6 col-md-12 col-sm-6">
                                    <MainContainer>
                                        <WalletContainer>
                                            <Wallet>
                                                {publicKey?
                                                    <WalletAmount>Your wallet balance: {((balance/LAMPORTS_PER_SOL) || 0).toLocaleString()} SOL</WalletAmount> :
                                                    <ConnectButton onClick={(e: { preventDefault: () => void; }) => {
                                                        if (
                                                          wallet?.adapter.name === SolanaMobileWalletAdapterWalletName
                                                        ) {
                                                          props.connect();
                                                          e.preventDefault();
                                                        }
                                                      }}>Connect Wallet</ConnectButton>}
                                            </Wallet>
                                        </WalletContainer>
                                        <MintContainer>
                                            <div className="descontainer">
                                                <NFT elevation={3}>
                                                    <h2>OnitBuddy</h2>
                                                    <br/> 
                                                    {//The below used to say wallet && props.isActive && props.whitelistTokenBalance > 0 ? <- We removed props.isActive due to whitelist use case
                                                    }
                                                    <div><Price
                                                        label={whitelistEnabled && (isWhitelistUser) ? (discountPrice+ " " + props.priceLabel) : (userPrice+ " " + props.priceLabel)}/>
                                                        <div className="content-left">
                                                            <div className="media">
                                                                <img src={imgdetail1} alt="Axies" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <br />
                                                    {anchorWallet && isActive && whitelistEnabled && (isWhitelistUser) &&
                                                        <h3>You own {whitelistTokenBalance} WL mint {isWhitelistUser ? "tokens" : "token"}.</h3>}
                                                    {anchorWallet && isActive && whitelistEnabled && (isWhitelistUser) &&
                                                        <h3>You are whitelisted and allowed to mint.</h3>}

                                                    {anchorWallet && props.isActive && props.endDate && Date.now() < props.endDate.getTime() &&
                                                        <Countdown
                                                            date={toDate(props.candyMachine?.state?.endSettings?.number)}
                                                            onMount={({completed}) => completed && props.setIsEnded(true)}
                                                            onComplete={() => {
                                                                props.setIsEnded(true);
                                                            }}
                                                            renderer={props.renderEndDateCounter}
                                                        />}
                                                    {anchorWallet && isActive &&
                                                        <h3>TOTAL MINTED : {props.itemsRedeemed} / {props.itemsAvailable}</h3>}
                                                    {anchorWallet && isActive && <BorderLinearProgress variant="determinate"
                                                        value={100 - (props.itemsRemaining * 100 / props.itemsAvailable)} />}
                                                    <br />
                                                    <MintButtonContainer>
                                                        {console.log("statis of !isWLOnly", !props.isWLOnly)}
                                                        {console.log("isWhitelistUser", isWhitelistUser)}
                                                        {console.log("candyMachine?.state.isActive ", candyMachine?.state.isActive )}
                                                        {console.log("!props.isActive", !props.isActive )}
                                                        {console.log("candyMachine?.state.gatekeeper", candyMachine?.state.gatekeeper)}
                                                        {console.log("publicKey", props.publicKey)}
                                                        {console.log("anchorWallet.signTransaction", anchorWallet?.signTransaction)}
                                                        {!props.isActive && !props.isEnded && props.goLiveDate && (!props.isWLOnly || isWhitelistUser) ? (
                                                            <Countdown
                                                                date={toDate(props.goLiveDate)}
                                                                onMount={({ completed }) => completed && props.setIsActive(!props.isEnded)}
                                                                onComplete={() => {
                                                                    props.setIsActive(!props.isEnded);
                                                                }}
                                                                renderer={props.renderGoLiveDateCounter}
                                                            />) : (
                                                            !anchorWallet ? ( 
                                                                <ConnectButton>Connect Wallet</ConnectButton>
                                                            ) : 
                                                            (!props.isWLOnly || isWhitelistUser) ? 
                                                                props.candyMachine?.state.isActive &&
                                                                props.candyMachine?.state.gatekeeper &&
                                                                    publicKey &&
                                                                    anchorWallet?.signTransaction ? (
                                                                    <GatewayProvider
                                                                        wallet={{
                                                                            publicKey:
                                                                                publicKey || new PublicKey(CANDY_MACHINE_PROGRAM),
                                                                            //@ts-ignore
                                                                            signTransaction: anchorWallet.signTransaction,
                                                                        }}
                                                                        // // Replace with following when added
                                                                        // gatekeeperNetwork={candyMachine.state.gatekeeper_network}
                                                                        gatekeeperNetwork={
                                                                            candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                                                                        } // This is the ignite (captcha) network
                                                                        /// Don't need this for mainnet
                                                                        clusterUrl={rpcUrl}
                                                                        cluster = {cluster}
                                                                        options={{ autoShowModal: false }}
                                                                    >
                                                                        <MintButton
                                                                            candyMachine={candyMachine}
                                                                            isMinting={isUserMinting}
                                                                            setIsMinting={(val) => setIsUserMinting(val)}
                                                                            onMint={props.onMint}
                                                                            isActive={
                                                                                isActive ||
                                                                                (isPresale && isWhitelistUser && isValidBalance)
                                                                            }
                                                                            //anchorWallet={anchorWallet}
                                                                        />
                                                                    </GatewayProvider>
                                                                ) : (
                                                                    <MintButton
                                                                        candyMachine={candyMachine}
                                                                        isMinting={isUserMinting}
                                                                        setIsMinting={(val) => setIsUserMinting(val)}
                                                                        onMint={props.onMint}
                                                                        isActive={
                                                                            isActive ||
                                                                            (isPresale && isWhitelistUser && isValidBalance)
                                                                        }
                                                                    />
                                                                ) :
                                                                <h2>Whitelisted Members Mint Only.</h2>
                                                        )}
                                                    </MintButtonContainer>
                                                    <br/>
                                                    {anchorWallet && props.isActive && props.solanaExplorerLink &&
                                                        <SolExplorerLink href={props.solanaExplorerLink} target="_blank">View on Solscan</SolExplorerLink>}
                                                </NFT>
                                            </div>
                                        </MintContainer>
                                    </MainContainer>
                                    {/* <div className="content-left">
                                        <div className="media">
                                            <img src={imgdetail1} alt="Axies" />
                                        </div>
                                    </div> */}
                                </div>
                                <div className="col-xl-6 col-md-12">
                                    <div className="content-right">
                                        <div className="sc-item-details">
                                            <h2 className="style2 mt-xl-4">Minting in Progress</h2>
                                            <div className="meta-item">
                                                <div className="right mt-xl-0">
                                                    <p className="mt-xl-1"></p>
                                                </div>
                                            </div>
                                            <div className="client-infor sc-card-product">
                                                <div className="meta-info">
                                                    {/* {console.log("props.isActive")}
                                                    {console.log(props.isActive)}
                                                    {console.log("props.whitelistEnabled")}
                                                    {console.log(props.whitelistEnabled)}
                                                    {console.log("props.whitelistTokenBalance")}
                                                    {console.log(props.whitelistTokenBalance)} */}
                                                    { //The below used to say wallet && props.isActive && props.whitelistTokenBalance > 0 ? <- We removed props.isActive due to whitelist use case
                                                    anchorWallet && isWhitelistUser ?
                                                        (<div className="author">
                                                            <div className="avatar">
                                                                <img src={tick} alt="Axies" />
                                                            </div>
                                                            <div className="info">
                                                                <span>Whitelist Status</span>
                                                                <h6> 
                                                                    <div>You have Whitelist Tickets</div>
                                                                </h6> 
                                                            </div>
                                                        </div>):
                                                        (<div className="author">
                                                            <div className="avatar">
                                                                <img src={cross} alt="Axies" />
                                                            </div>
                                                            <div className="info">
                                                                <span>Whitelist Status</span>
                                                                <h6> 
                                                                    <div>No Whitelist Tickets.</div>
                                                                </h6> 
                                                            </div>
                                                        </div>)
                                                    }
                                                </div>
                                                <div className="meta-info">
                                                    {anchorWallet && props.isActive && props.whitelistEnabled ?
                                                        (<div className="author">
                                                            <div className="avatar">
                                                                <img src={discount} alt="Axies" />
                                                            </div>
                                                            <div className="info">
                                                                <span>Presale Discount if whitelisted</span>
                                                                { props.isWLOnly ? 
                                                                (<h6> <div> {(((discountPrice)*100).toFixed(0))+'%'}</div> </h6>):
                                                                (<h6> <div> {(((discountPrice/userPrice)*100).toFixed(0))+'%'}</div></h6>)
                                                                }
                                                            </div>
                                                        </div>) :
                                                        (<div className="author">
                                                            <div className="avatar">
                                                                <img src={discount} alt="Axies" />
                                                            </div>
                                                            <div className="info">
                                                                <span>Presale Discount if whitelisted</span>
                                                                { props.isWLOnly ?
                                                                (<h6><div> {((((discountPrice)*100)).toFixed(0))+'%'}</div></h6>):
                                                                (<h6> <div> {(((discountPrice /userPrice)*100).toFixed(0))+'%'}</div></h6>)
                                                                }
                                                            </div>
                                                        </div>) 
                                                    }
                                                </div>
                                            </div>
                                            <p> Join our Discord to have your wallet address whitelisted. Community members who become buddies will receive a Whitelist Token airdropped into their wallets. From there you will be able to mint your OnitBuddy NFT at a discounted price. The earlier you join the whitelist the higher the number of NFTs you get to mint. Once whitelisted you can mint your OnitBuddies here.</p>
                                            <div className="meta-item-details style2">
                                                <div className="item meta-price">
                                                    <span className="heading">Price per NFT</span>
                                                    <div className="price">
                                                        <div className="price-box">
                                                            {
                                                            //The below used to say props.isActive && props.whitelistEnabled && (props.whitelistTokenBalance > 0) <- We removed props.isActive due to whitelist use case
                                                            }
                                                            <h5>{props.whitelistEnabled && (isWhitelistUser) ? (discountPrice + " " + props.priceLabel) : (userPrice + " " + props.priceLabel)}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="item count-down">
                                                    <span className="heading style-2">Your Wallet balance</span>
                                                    <div className="price-box">
                                                              {anchorWallet ?
                                                    <h5>{((balance/LAMPORTS_PER_SOL) || 0).toLocaleString()} SOL</h5> :
                                                    <span>Balance Not Available</span>}
                                                        </div>
                                                    {/* <Countdown date={Date.now() + 500000000}>
                                                    <span>You are good to go!</span>
                                                </Countdown> */}
                                                </div>
                                            </div>
                                            {
                                             //This used to say wallet && props.isActive && props.whitelistEnabled && (props.whitelistTokenBalance > 0) ? <-We removed the props.isActive due to the whitelist use case
                                            }
                                            {anchorWallet&& props.whitelistEnabled && (isWhitelistUser) ?
                                                (<div></div> )
                                                : <a target="_blank" rel="noreferrer" href='https://discord.gg/RWs3DP2' className="sc-button loadmore style bag fl-button pri-3"><span>Get Whitelisted</span></a>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SliderStyle2;