import styled from "styled-components";
import Button from "@mui/material/Button";
import { CandyMachineAccount } from "./candy-machine";
import { CircularProgress } from "@mui/material";
import { GatewayStatus, useGateway } from "@civic/solana-gateway-react";
import { useEffect, useState, useRef } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
    findGatewayToken,
    getGatewayTokenAddressForOwnerAndGatekeeperNetwork,
    onGatewayTokenChange,
    removeAccountChangeListener,
  } from "@identity.com/solana-gateway-ts";
import { CIVIC_GATEKEEPER_NETWORK } from "./utility/utils";

export const CTAButton = styled(Button)`
  display: block !important;
  margin: 0 auto !important;
  background-color: var(--primary-color3) !important;
  border: 1px solid !important;
  border-color: var(--primary-color3) !important;
  color: var(--title-text-color) !important;
  min-width: 200px !important;
  font-size: 1em !important;
`;

export const MintButton = ({
                               onMint,
                               candyMachine,
                               isMinting,
                               setIsMinting,
                               //isEnded,
                               isActive,
                               //isSoldOut
                           }: {
    onMint: () => Promise<void>;
    candyMachine?: CandyMachineAccount;
    isMinting: boolean;
    setIsMinting: (val: boolean) => void;
    //isEnded: boolean;
    isActive: boolean;
    //isSoldOut: boolean;
}) => {
    const wallet = useWallet();
    const connection = useConnection();
    const [verified, setVerified] = useState(false);
    const { requestGatewayToken, gatewayStatus } = useGateway();
    const [webSocketSubscriptionId, setWebSocketSubscriptionId] = useState(-1);
    const [clicked, setClicked] = useState(false);
    const [waitForActiveToken, setWaitForActiveToken] = useState(false);

    const getMintButtonContent = () => {
        if (candyMachine?.state.isSoldOut) {
          return "SOLD OUT";
        } else if (isMinting) {
          return <CircularProgress />;
        } else if (
          candyMachine?.state.isPresale ||
          candyMachine?.state.isWhitelistOnly
        ) {
          return "WHITELIST MINT";
        }
    
        return "MINT";
      };

    useEffect(() => {
        const mint = async () => {
            await removeAccountChangeListener(
                connection.connection,
                webSocketSubscriptionId
            );
            await onMint();

            setClicked(false);
            setVerified(false);
        };
        if (verified && clicked) {
            mint();
        }
    }, [
        verified,
        clicked,
        connection.connection,
        onMint,
        webSocketSubscriptionId,
    ]);
    
    const previousGatewayStatus = usePrevious(gatewayStatus); 
    useEffect(() => {
        const fromStates = [
            GatewayStatus.NOT_REQUESTED,
            GatewayStatus.REFRESH_TOKEN_REQUIRED,
        ];
        const invalidToStates = [...fromStates, GatewayStatus.UNKNOWN];
        if (
            fromStates.find((state) => previousGatewayStatus === state) &&
            !invalidToStates.find((state) => gatewayStatus === state)
        ) {
            setIsMinting(true);
        }
        console.log("change: ", GatewayStatus[gatewayStatus]);
    }, [waitForActiveToken, previousGatewayStatus, gatewayStatus]);

    useEffect(() => {
        if (waitForActiveToken && gatewayStatus === GatewayStatus.ACTIVE) {
            console.log("Minting after token active");
            setWaitForActiveToken(false);
            onMint();
        }
    }, [waitForActiveToken, gatewayStatus, onMint]);

    console.log("disabled: ", isMinting || !isActive)

    return (
      <CTAButton
      disabled={isMinting || !isActive}
      onClick={async () => {
        console.log("candyMachine?.state.isActive",candyMachine?.state.isActive,"candyMachine?.state.gatekeeper", candyMachine?.state.gatekeeper);
        if (candyMachine?.state.isActive && candyMachine?.state.gatekeeper) {
          const network =
            candyMachine.state.gatekeeper.gatekeeperNetwork.toBase58();
          console.log("network: ", network);
          if (network === CIVIC_GATEKEEPER_NETWORK) {
            console.log("gatewayStatus")
            if (gatewayStatus === GatewayStatus.ACTIVE) {
              await onMint();
            } else {
              // setIsMinting(true);
              setWaitForActiveToken(true);
              await requestGatewayToken();
              console.log("after: ", gatewayStatus);
            }
          } else if (
            network === "ttib7tuX8PTWPqFsmUFQTj78MbRhUmqxidJRDv4hRRE" ||
            network === "tibePmPaoTgrs929rWpu755EXaxC7M3SthVCf6GzjZt"
          ) {
            setClicked(true);
            const gatewayToken = await findGatewayToken(
              connection.connection,
              wallet.publicKey!,
              candyMachine.state.gatekeeper.gatekeeperNetwork
            );
            console.log("gatewayToken: ", gatewayToken);
            if (gatewayToken?.isValid()) {
              await onMint();
            } else {
              window.open(
                `https://verify.encore.fans/?gkNetwork=${network}`,
                "_blank"
              );

              const gatewayTokenAddress =
                await getGatewayTokenAddressForOwnerAndGatekeeperNetwork(
                  wallet.publicKey!,
                  candyMachine.state.gatekeeper.gatekeeperNetwork
                );
              console.log("gatewayTokenAddress: ", gatewayTokenAddress);
              setWebSocketSubscriptionId(
                onGatewayTokenChange(
                  connection.connection,
                  gatewayTokenAddress,
                  () => setVerified(true),
                  "confirmed"
                )
              );
            }
          } else {
            setClicked(false);
            throw new Error(`Unknown Gatekeeper Network: ${network}`);
          }
        } else {
          console.log("This is the onMint that gets executed");
          await onMint();
          setClicked(false);
        }
      }}
      variant="contained"
    >
      {getMintButtonContent()}
    </CTAButton>
    );
};

function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }