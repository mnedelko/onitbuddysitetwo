import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import * as anchor from "@project-serum/anchor";
import {
    Commitment,
    Connection,
    PublicKey,
    Transaction,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";
import {WalletAdapterNetwork} from '@solana/wallet-adapter-base';

import {useWallet} from "@solana/wallet-adapter-react";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
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

const cluster = process.env.REACT_APP_SOLANA_NETWORK!.toString();
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

const ConnectButton:any = styled(WalletMultiButton)`
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
}

const SliderStyle2 = (props: SliderProps) => {
    //State Definitions
    const [balance, setBalance] = useState<number>();
    const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT
    const [isActive, setIsActive] = useState(false); // true when countdown completes or whitelisted
    const [solanaExplorerLink, setSolanaExplorerLink] = useState<string>("");
    const [itemsAvailable, setItemsAvailable] = useState(0);
    const [itemsRedeemed, setItemsRedeemed] = useState(0);
    const [itemsRemaining, setItemsRemaining] = useState(0);
    const [isSoldOut, setIsSoldOut] = useState(false);
    const [payWithSplToken, setPayWithSplToken] = useState(false);
    const [price, setPrice] = useState(0);
    const [priceLabel, setPriceLabel] = useState<string>("SOL");
    const [whitelistPrice, setWhitelistPrice] = useState(0);
    const [whitelistEnabled, setWhitelistEnabled] = useState(false);
    const [isBurnToken, setIsBurnToken] = useState(false);
    const [whitelistTokenBalance, setWhitelistTokenBalance] = useState(0);
    const [isEnded, setIsEnded] = useState(false);
    const [endDate, setEndDate] = useState<Date>();
    const [isPresale, setIsPresale] = useState(false);
    const [isWLOnly, setIsWLOnly] = useState(false);
    const [priceDiscount, setPriceDiscount] = useState(0);
    const [alertState, setAlertState] = useState<AlertState>({
        open: false,
        message: "",
        severity: undefined,
    });

    const [needTxnSplit, setNeedTxnSplit] = useState(true);
    const [setupTxn, setSetupTxn] = useState<SetupState>();

    //This defines the wallet
    const wallet = useWallet();
    const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
    
    const rpcUrl = props.rpcHost;
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
    
    const anchorWallet = useMemo(() => {
        if (
            !wallet ||
            !wallet.publicKey ||
            !wallet.signAllTransactions ||
            !wallet.signTransaction
        ) {
            return;
        }

        return {
            publicKey: wallet.publicKey,
            signAllTransactions: wallet.signAllTransactions,
            signTransaction: wallet.signTransaction,
        } as anchor.Wallet;
    }, [wallet]);
    
    const refreshCandyMachineState = useCallback(
        async (commitment: Commitment = 'confirmed') => {
            if (!anchorWallet) { 
                return;
            }

            const connection = new Connection(props.rpcHost, commitment);

            if (props.candyMachineId){
                try{
                    // this is where we are identifying the candymachine we must connect to
                    const cndy = await getCandyMachineState(
                        anchorWallet,
                        props.candyMachineId,
                        props.connection
                    );

                    //This is where we are setting the candymachine attributes
                    setCandyMachine(cndy);
                    //console.log("this is the candymachine payload");
                    //console.log(cndy);
                    setItemsAvailable(cndy.state.itemsAvailable);
                    setItemsRemaining(cndy.state.itemsRemaining);
                    setItemsRedeemed(cndy.state.itemsRedeemed);

                    //this is where we are implementing the decimals
                    var divider = 1;
                    if (decimals) {
                        divider = +('1' + new Array(decimals).join('0').slice() + '0');
                    }

                    // detect if using spl-token to mint
                    if (cndy.state.tokenMint) {
                        setPayWithSplToken(true);
                        // Customize your SPL-TOKEN Label HERE
                        // TODO: get spl-token metadata name
                        setPriceLabel(splTokenName);
                        setPrice(cndy.state.price.toNumber() / divider);
                        setWhitelistPrice(cndy.state.price.toNumber() / divider);
                    } else {
                        setPrice(cndy.state.price.toNumber() / LAMPORTS_PER_SOL);
                        setWhitelistPrice(cndy.state.price.toNumber() / LAMPORTS_PER_SOL);
                    }


                    // fetch whitelist token balance
                    if (cndy.state.whitelistMintSettings) {
                        setWhitelistEnabled(true); //This is a status that states that the candymanchine has a whitelist
                        setIsBurnToken(cndy.state.whitelistMintSettings.mode.burnEveryTime);
                        setIsPresale(cndy.state.whitelistMintSettings.presale);
                        setIsWLOnly(!isPresale && cndy.state.whitelistMintSettings.discountPrice === null);

                        if (cndy.state.whitelistMintSettings.discountPrice !== null && cndy.state.whitelistMintSettings.discountPrice !== cndy.state.price) {
                            if (cndy.state.tokenMint) {
                                setWhitelistPrice(cndy.state.whitelistMintSettings.discountPrice?.toNumber() / divider);
                            } else {
                                setWhitelistPrice(cndy.state.whitelistMintSettings.discountPrice?.toNumber() / LAMPORTS_PER_SOL);
                            }
                        }

                        let balance = 0;
                        try {
                            const tokenBalance =
                                await props.connection.getTokenAccountBalance(
                                    (
                                        await getAtaForMint(
                                            cndy.state.whitelistMintSettings.mint,
                                            anchorWallet.publicKey,
                                        )
                                    )[0],
                                );

                            balance = tokenBalance?.value?.uiAmount || 0;
                        } catch (e) {
                            console.error(e);
                            balance = 0;
                        }
                        if (commitment !== "processed") {
                            setWhitelistTokenBalance(balance);
                        }
                        setIsActive(isPresale && !isEnded && balance > 0);
                        
                    } else {
                        setWhitelistEnabled(false);
                    }

                    // end the mint when date is reached
                    if (cndy?.state.endSettings?.endSettingType.date) {
                        setEndDate(toDate(cndy.state.endSettings.number));
                        if (
                            cndy.state.endSettings.number.toNumber() <
                            new Date().getTime() / 1000
                        ) {
                            setIsEnded(true);
                            setIsActive(false);
                        }
                    }
                    // end the mint when amount is reached
                    if (cndy?.state.endSettings?.endSettingType.amount) {
                        let limit = Math.min(
                            cndy.state.endSettings.number.toNumber(),
                            cndy.state.itemsAvailable,
                        );
                        setItemsAvailable(limit);
                        if (cndy.state.itemsRedeemed < limit) {
                            setItemsRemaining(limit - cndy.state.itemsRedeemed);
                        } else {
                            setItemsRemaining(0);
                            cndy.state.isSoldOut = true;
                            setIsEnded(true);
                        }
                    } else {
                        setItemsRemaining(cndy.state.itemsRemaining);
                    }

                    if (cndy.state.isSoldOut) {
                        setIsActive(false);
                    }

                    const [collectionPDA] = await getCollectionPDA(props.candyMachineId);
                    const collectionPDAAccount = await connection.getAccountInfo(
                        collectionPDA,
                    );

                    const txnEstimate = 
                        892 +
                        (!!collectionPDAAccount && cndy.state.retainAuthority ? 182 : 0) +
                        (cndy.state.tokenMint ? 66 : 0) +
                        (cndy.state.whitelistMintSettings ? 34 : 0) +
                        (cndy.state.whitelistMintSettings?.mode?.burnEveryTime ? 34 : 0) +
                        (cndy.state.gatekeeper ? 33 : 0) +
                        (cndy.state.gatekeeper?.expireOnUse ? 66 : 0);

                    setNeedTxnSplit(txnEstimate > 1230);
                } catch (e) {
                    if (e instanceof Error) {
                        if (
                            e.message === `Account does not exist ${props.candyMachineId}`
                        ) {
                            setAlertState({
                                open: true,
                                message: `Couldn't fetch candy machine state from candy machine with address: ${props.candyMachineId}, using rpc: ${props.rpcHost}! You probably typed the REACT_APP_CANDY_MACHINE_ID value in wrong in your .env file, or you are using the wrong RPC!`,
                                severity: 'error',
                                hideDuration: null,
                            });
                        } else if (
                            e.message.startsWith('failed to get info about account')
                        ) {
                            setAlertState({
                                open: true,
                                message: `Couldn't fetch candy machine state with rpc: ${props.rpcHost}! This probably means you have an issue with the REACT_APP_SOLANA_RPC_HOST value in your .env file, or you are not using a custom RPC!`,
                                severity: 'error',
                                hideDuration: null,
                            });
                        }
                    } else {
                        setAlertState({
                            open: true,
                            message: `${e}`,
                            severity: 'error',
                            hideDuration: null,
                        });
                    }
                    console.log('error');
                }
            } else {
                setAlertState({
                    open: true,
                    message: `Your REACT_APP_CANDY_MACHINE_ID value in the .env file doesn't look right! Make sure you enter it in as plain base-58 address!`,
                    severity: 'error',
                    hideDuration: null,
                });
            }
        },
        [anchorWallet, props.candyMachineId, props.rpcHost, isEnded, isPresale, props.connection],
    );

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
        if (isBurnToken && whitelistTokenBalance && whitelistTokenBalance > 0) {
            let balance = whitelistTokenBalance - qty;
            setWhitelistTokenBalance(balance);
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

    const onMint = async (
        beforeTransactions: Transaction[] = [],
        afterTransactions: Transaction[] = [],
    ) => {
        try {
            if (wallet.connected && candyMachine?.program && wallet.publicKey) {
                setIsMinting(true);
                let setupMint: SetupState | undefined;
                if (needTxnSplit && setupTxn === undefined) {
                    setAlertState({
                        open: true,
                        message: 'Please validate account setup transaction',
                        severity: 'info',
                    });
                    setupMint = await createAccountsForMint(
                        candyMachine,
                        wallet.publicKey,
                    );
                    let status: any = {err: true};
                    if (setupMint.transaction) {
                        status = await awaitTransactionSignatureConfirmation(
                            setupMint.transaction,
                            props.txTimeout,
                            props.connection,
                            true,
                        );
                    }
                    if (status && !status.err) {
                        setSetupTxn(setupMint);
                        setAlertState({
                            open: true,
                            message:
                                'Setup transaction succeeded! You can now validate mint transaction',
                            severity: 'info',
                        });
                    } else {
                        setAlertState({
                            open: true,
                            message: 'Mint failed! Please try again!',
                            severity: 'error',
                        });
                        return;
                    }
                }

                const setupState = setupMint ?? setupTxn;
                const mint = setupState?.mint ?? anchor.web3.Keypair.generate();
                let mintResult = await mintOneToken(
                    candyMachine,
                    wallet.publicKey,
                    mint,
                    beforeTransactions,
                    afterTransactions,
                    setupState,
                );

                let status: any = {err: true};
                let metadataStatus = null;
                if (mintResult) {
                    status = await awaitTransactionSignatureConfirmation(
                        mintResult.mintTxId,
                        props.txTimeout,
                        props.connection,
                        true,
                    );

                    metadataStatus =
                        await candyMachine.program.provider.connection.getAccountInfo(
                            mintResult.metadataKey,
                            'processed',
                        );
                    //console.log('Metadata status: ', !!metadataStatus);
                }

                if (status && !status.err && metadataStatus) {
                    setAlertState({
                        open: true,
                        message: 'Congratulations! Mint succeeded!',
                        severity: 'success',
                    });

                    // update front-end amounts
                    displaySuccess(mint.publicKey);
                    refreshCandyMachineState('processed');
                } else if (status && !status.err) {
                    setAlertState({
                        open: true,
                        message:
                            'Mint likely failed! Anti-bot SOL 0.01 fee potentially charged! Check the explorer to confirm the mint failed and if so, make sure you are eligible to mint before trying again.',
                        severity: 'error',
                        hideDuration: 8000,
                    });
                    refreshCandyMachineState();
                } else {
                    setAlertState({
                        open: true,
                        message: 'Mint failed! Please try again!',
                        severity: 'error',
                    });
                    refreshCandyMachineState();
                }
            }
        } catch (error: any) {
            // TODO: blech:
            let message = error.msg || 'Minting failed! Please try again!';
            if (!error.msg) {
                if (!error.message) {
                    message = 'Transaction Timeout! Please try again.';
                } else if (error.message.indexOf('0x138')) {
                } else if (error.message.indexOf('0x137')) {
                    message = `SOLD OUT!`;
                } else if (error.message.indexOf('0x135')) {
                    message = `Insufficient funds to mint. Please fund your wallet.`;
                }
            } else {
                if (error.code === 311) {
                    message = `SOLD OUT!`;
                } else if (error.code === 312) {
                    message = `Minting period hasn't started yet.`;
                }
            }

            setAlertState({
                open: true,
                message,
                severity: "error",
            });
        } finally {
            setIsMinting(false);
        }
    };

    useEffect(() => {
        (async () => {
            if (anchorWallet) {
                const balance = await props.connection.getBalance(anchorWallet!.publicKey);
                setBalance(balance / LAMPORTS_PER_SOL);
            }
        })();
    }, [anchorWallet, props.connection]);

    //This refreshes the candymachine state
    useEffect(() => {
        refreshCandyMachineState();
    }, [
        anchorWallet,
        props.candyMachineId,
        props.connection,
        isEnded,
        isPresale,
        refreshCandyMachineState
    ]);
    

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
                                        goLiveDate= {candyMachine?.state.goLiveDate}
                                        isGatekeeper = {candyMachine?.state.gatekeeper}
                                        //consoleThis ={consoleThis}
                                        wallet = {wallet}
                                        balance = {balance}
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
                                        isBurnToken = {isBurnToken}
                                        setIsBurnToken = {setIsBurnToken}
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
    //console.log('This is the console log');
    //console.log(wallet);
    //console.log(props.isActive);
    //props.consoleThis();
    
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
                                                {wallet.privateKey ?
                                                    <WalletAmount>Your wallet balance: {(props.balance || 0).toLocaleString()} SOL</WalletAmount> :
                                                    <ConnectButton>Connect Wallet</ConnectButton>}
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
                                                        label={props.whitelistEnabled && (props.whitelistTokenBalance > 0) ? (props.whitelistPrice + " " + props.priceLabel) : (props.price + " " + props.priceLabel)}/>
                                                        <div className="content-left">
                                                            <div className="media">
                                                                <img src={imgdetail1} alt="Axies" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <br />
                                                    {wallet && props.isActive && props.whitelistEnabled && (props.whitelistTokenBalance > 0) && props.isBurnToken &&
                                                        <h3>You own {props.whitelistTokenBalance} WL mint {props.whitelistTokenBalance > 1 ? "tokens" : "token"}.</h3>}
                                                    {wallet && props.isActive && props.whitelistEnabled && (props.whitelistTokenBalance > 0) && !props.isBurnToken &&
                                                        <h3>You are whitelisted and allowed to mint.</h3>}

                                                    {wallet && props.isActive && props.endDate && Date.now() < props.endDate.getTime() &&
                                                        <Countdown
                                                            date={toDate(props.candyMachine?.state?.endSettings?.number)}
                                                            onMount={({completed}) => completed && props.setIsEnded(true)}
                                                            onComplete={() => {
                                                                props.setIsEnded(true);
                                                            }}
                                                            renderer={props.renderEndDateCounter}
                                                        />}
                                                    {wallet && props.isActive &&
                                                        <h3>TOTAL MINTED : {props.itemsRedeemed} / {props.itemsAvailable}</h3>}
                                                    {wallet && props.isActive && <BorderLinearProgress variant="determinate"
                                                        value={100 - (props.itemsRemaining * 100 / props.itemsAvailable)} />}
                                                    <br />
                                                    <MintButtonContainer>
                                                        {/* {console.log("statis of !isActive")}
                                                        {console.log(!props.isActive)}
                                                        {console.log("statis of !isEnded")}
                                                        {console.log(!props.isEnded)}
                                                        {console.log("statis of goLiveDate")}
                                                        {console.log(JSON.stringify(props.goLiveDate))} */}
                                                        {!props.isActive && !props.isEnded && props.goLiveDate && (!props.isWLOnly || props.whitelistTokenBalance > 0) ? (
                                                            <Countdown
                                                                date={toDate(props.goLiveDate)}
                                                                onMount={({ completed }) => completed && props.setIsActive(!props.isEnded)}
                                                                onComplete={() => {
                                                                    props.setIsActive(!props.isEnded);
                                                                }}
                                                                renderer={props.renderGoLiveDateCounter}
                                                            />) : (
                                                            !wallet ? ( "this is another placeholder"
                                                                // <ConnectButton>Connect Wallet</ConnectButton>
                                                            ) : 
                                                            (!props.isWLOnly || props.whitelistTokenBalance > 0) ? 
                                                                props.isGatekeeper &&
                                                                    wallet.publicKey &&
                                                                    wallet.signTransaction ? (
                                                                    <GatewayProvider
                                                                        wallet={{
                                                                            publicKey:
                                                                                wallet.publicKey ||
                                                                                new PublicKey(CANDY_MACHINE_PROGRAM),
                                                                            //@ts-ignore
                                                                            signTransaction: wallet.signTransaction,
                                                                        }}
                                                                        // // Replace with following when added
                                                                        // gatekeeperNetwork={candyMachine.state.gatekeeper_network}
                                                                        gatekeeperNetwork={
                                                                            props.candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                                                                        } // This is the ignite (captcha) network
                                                                        /// Don't need this for mainnet
                                                                        clusterUrl={props.rpcUrl}
                                                                        cluster = {cluster}
                                                                        options={{ autoShowModal: false }}
                                                                    >
                                                                        <MintButton
                                                                            candyMachine={props.candyMachine}
                                                                            isMinting={props.isMinting}
                                                                            isActive={props.isActive}
                                                                            isEnded={props.isEnded}
                                                                            isSoldOut={props.isSoldOut}
                                                                            onMint={props.onMint}
                                                                        />
                                                                    </GatewayProvider>
                                                                ) : (
                                                                    <MintButton
                                                                        candyMachine={props.candyMachine}
                                                                        isMinting={props.isMinting}
                                                                        isActive={props.isActive}
                                                                        isEnded={props.isEnded}
                                                                        isSoldOut={props.isSoldOut}
                                                                        onMint={props.onMint}
                                                                    />
                                                                ) :
                                                                <h2>Whitelisted Members Mint Only.</h2>
                                                        )}
                                                    </MintButtonContainer>
                                                    <br/>
                                                    {wallet && props.isActive && props.solanaExplorerLink &&
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
                                            <h2 className="style2 mt-xl-4">Whitelist Presale starts Jan 23rd</h2>
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
                                                    wallet && props.whitelistTokenBalance > 0 ?
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
                                                    {wallet && props.isActive && props.whitelistEnabled ?
                                                        (<div className="author">
                                                            <div className="avatar">
                                                                <img src={discount} alt="Axies" />
                                                            </div>
                                                            <div className="info">
                                                                <span>Presale Discount if whitelisted</span>
                                                                { props.isWLOnly ? 
                                                                (<h6> <div> {((props.whitelistPrice)*100)+'%'}</div> </h6>):
                                                                (<h6> <div> {((props.whitelistPrice/props.price)*100)+'%'}</div></h6>)
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
                                                                (<h6><div> {(((props.whitelistPrice)*100))+'%'}</div></h6>):
                                                                (<h6> <div> {(((props.whitelistPrice /props.price)*100).toFixed(0))+'%'}</div></h6>)
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
                                                            <h5>{props.whitelistEnabled && (props.whitelistTokenBalance > 0) ? (props.whitelistPrice + " " + props.priceLabel) : (props.price + " " + props.priceLabel)}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="item count-down">
                                                    <span className="heading style-2">Your Wallet balance</span>
                                                    <div className="price-box">
                                                              {wallet ?
                                                    <h5>{(props.balance || 0).toLocaleString()} SOL</h5> :
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
                                            {wallet && props.whitelistEnabled && (props.whitelistTokenBalance > 0) ?
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