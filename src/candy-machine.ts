import * as anchor from '@project-serum/anchor';

import { MintLayout, TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import { 
  SystemProgram,
  Transaction,
  SYSVAR_SLOT_HASHES_PUBKEY,
 } from '@solana/web3.js';
import { sendTransactions, SequenceType } from './connection';

import {
  CIVIC,
  getAtaForMint,
  getNetworkExpire,
  getNetworkToken,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
} from "./utility/utils";

export const CANDY_MACHINE_PROGRAM = new anchor.web3.PublicKey(
  "cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ"
);

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);

interface CandyMachineState {
  authority: anchor.web3.PublicKey;
  itemsAvailable: number;
  itemsRedeemed: number;
  itemsRemaining: number;
  treasury: anchor.web3.PublicKey;
  tokenMint: null | anchor.web3.PublicKey;
  isSoldOut: boolean;
  isActive: boolean;
  isPresale: boolean;
  isWhitelistOnly: boolean;
  goLiveDate: null | anchor.BN;
  price: anchor.BN;
  gatekeeper: null | {
    expireOnUse: boolean;
    gatekeeperNetwork: anchor.web3.PublicKey;
  };
  endSettings: null | {
    number: anchor.BN;
    endSettingType: any;
  };
  whitelistMintSettings: null | {
    mode: any;
    mint: anchor.web3.PublicKey;
    presale: boolean;
    discountPrice: null | anchor.BN;
  };
  hiddenSettings: null | {
    name: string;
    uri: string;
    hash: Uint8Array;
  };
  retainAuthority: boolean;
}

export interface CandyMachineAccount {
  id: anchor.web3.PublicKey;
  program: anchor.Program;
  state: CandyMachineState;
}

export const awaitTransactionSignatureConfirmation = async (
  txid: anchor.web3.TransactionSignature,
  timeout: number,
  connection: anchor.web3.Connection,
  queryStatus = false
): Promise<anchor.web3.SignatureStatus | null | void> => {
  let done = false;
  let status: anchor.web3.SignatureStatus | null | void = {
    slot: 0,
    confirmations: 0,
    err: null,
  };
  const subId = 0;
  status = await new Promise(async (resolve, reject) => {
    setTimeout(() => {
      if (done) {
        return;
      }
      done = true;
      console.log('Rejecting for timeout...');
      reject({ timeout: true });
    }, timeout);

    while (!done && queryStatus) {
      // eslint-disable-next-line no-loop-func
      (async () => {
        try {
          const signatureStatuses = await connection.getSignatureStatuses([
            txid,
          ]);
          status = signatureStatuses && signatureStatuses.value[0];
          console.log("signatureStatuses", signatureStatuses, "txid", txid, "status", status, "done", done, "queryStatus", queryStatus);
          if (!done) {
            if (!status) {
              console.log("REST null result for", txid, status);
            } else if (status.err) {
              console.log("REST error for", txid, status);
              done = true;
              reject(status.err);
            } else if (!status.confirmations) {
              console.log("REST no confirmations for", txid, status);
            } else {
              console.log("REST confirmation for", txid, status);
              done = true;
              resolve(status);
            }
          }
        } catch (e) {
          if (!done) {
            console.log("REST connection error: txid", txid, e);
          }
        }
      })();
      await sleep(2000);
    }
  });

  //@ts-ignore
  try {
    await connection.removeSignatureListener(subId);
  } catch (e) {
    // ignore
  }
  done = true;
  console.log("Returning status", status);
  return status;
};

const createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: anchor.web3.PublicKey,
  payer: anchor.web3.PublicKey,
  walletAddress: anchor.web3.PublicKey,
  splTokenMintAddress: anchor.web3.PublicKey
) => {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
    { pubkey: walletAddress, isSigner: false, isWritable: false },
    { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  return new anchor.web3.TransactionInstruction({
    keys,
    programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    data: Buffer.from([]),
  });
};

//This is where we are identifying the right candymachine, connect to it and get its state getting the CadyMachine's state
export const getCandyMachineState = async (
  anchorWallet: anchor.Wallet,
  candyMachineId: anchor.web3.PublicKey,
  connection: anchor.web3.Connection,
): Promise<CandyMachineAccount> => {
  const provider = new anchor.Provider(connection, anchorWallet, {
    preflightCommitment: "processed",
  });

  const getProgramState = async (): Promise<[anchor.Program, any]> => {
    const idl = await anchor.Program.fetchIdl(CANDY_MACHINE_PROGRAM, provider);
    const program = new anchor.Program(idl!, CANDY_MACHINE_PROGRAM, provider);
    const state: any = await program.account.candyMachine.fetch(candyMachineId);
    return [program, state];
  };

  const getCurrentBlockTime = async (): Promise<number> => {
    const slot = await connection.getSlot();
    return (await connection.getBlockTime(slot)) ?? new Date().getTime() / 1000;
  };

  const [[program, state], currentBlockTime] = await Promise.all([
    getProgramState(),
    getCurrentBlockTime(),
  ]);
  const itemsAvailable = state.data.itemsAvailable.toNumber();
  const itemsRedeemed = state.itemsRedeemed.toNumber();
  const itemsRemaining = itemsAvailable - itemsRedeemed;
  const timeDiff = new Date().getTime() / 1000 - currentBlockTime;
  const goLiveDate =
    state.data.goLiveDate !== null ? state.data.goLiveDate + timeDiff : null;

  return {
    id: candyMachineId,
    program,
    state: {
      authority: state.authority,
      itemsAvailable,
      itemsRedeemed,
      itemsRemaining,
      isSoldOut: itemsRemaining === 0,
      isActive: false,
      isPresale: false,
      isWhitelistOnly: false,
      goLiveDate: state.data.goLiveDate,
      treasury: state.wallet,
      tokenMint: state.tokenMint,
      gatekeeper: state.data.gatekeeper,
      endSettings: state.data.endSettings,
      whitelistMintSettings: state.data.whitelistMintSettings,
      hiddenSettings: state.data.hiddenSettings,
      price: state.data.price,
      retainAuthority: state.data.retainAuthority,
    },
  };
};

export const getFreezePdaState = async (
  program: anchor.Program,
  freezePda: anchor.web3.PublicKey
): Promise<any> => {
  try {
    const state: any = await program.account.freezePda.fetch(freezePda);
    return state;
  } catch (error) {
    return null;
  }
};

const getMasterEdition = async (
  mint: anchor.web3.PublicKey,
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};

const getMetadata = async (
  mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};

export const getCandyMachineCreator = async (
  candyMachine: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("candy_machine"), candyMachine.toBuffer()],
    CANDY_MACHINE_PROGRAM
  );
};

export const getFreezePda = async (
  candyMachine: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("freeze"), candyMachine.toBuffer()],
    CANDY_MACHINE_PROGRAM
  );
};

export const getCollectionPDA = async (
  candyMachineAddress: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("collection"), candyMachineAddress.toBuffer()],
    CANDY_MACHINE_PROGRAM
  );
};

export interface CollectionData {
  mint: anchor.web3.PublicKey;
  candyMachine: anchor.web3.PublicKey;
}

export const getCollectionAuthorityRecordPDA = async (
  mint: anchor.web3.PublicKey,
  newAuthority: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("collection_authority"),
        newAuthority.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};

export type SetupState = {
  mint: anchor.web3.Keypair;
  userTokenAccount: anchor.web3.PublicKey;
  transaction: string;
};

export const createAccountsForMint = async (
  candyMachine: CandyMachineAccount,
  payer: anchor.web3.PublicKey
): Promise<SetupState> => {
  console.log("payer in createAcccountsForMint", payer);
  const mint = anchor.web3.Keypair.generate();
  const userTokenAccountAddress = (
    await getAtaForMint(mint.publicKey, payer)
  )[0];
  console.log ("userTokenAccountAddress", userTokenAccountAddress);
  console.log("1st Mint", mint);
  const signers: anchor.web3.Keypair[] = [mint];
  console.log("signers in creasteAccountsForMint", signers);
  const instructions = [
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mint.publicKey,
      space: MintLayout.span,
      lamports:
        await candyMachine.program.provider.connection.getMinimumBalanceForRentExemption(
          MintLayout.span
        ),
      
      programId: TOKEN_PROGRAM_ID,
    }),
    Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      0,
      payer,
      payer
    ),
    createAssociatedTokenAccountInstruction(
      userTokenAccountAddress,
      payer,
      payer,
      mint.publicKey
    ),
    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      userTokenAccountAddress,
      payer,
      [],
      1
    ),
  ];
  console.log("Instructions in createAccountsForMint", JSON.stringify(instructions));

  //candyMachine.program.provider.wallet.signAllTransactions

  return {
    mint: mint,
    userTokenAccount: userTokenAccountAddress,
    transaction: (
      await sendTransactions(
        candyMachine.program.provider.connection,
        candyMachine,
        [instructions],
        [signers],
        SequenceType.StopOnFailure,
        "singleGossip",
        () => {},
        () => false,
        undefined,
        [],
        []
      )
    ).txs[0].txid,
  };
};

type MintResult = {
  mintTxId: string;
  metadataKey: anchor.web3.PublicKey;
};

export const mintOneToken = async (
  candyMachine: CandyMachineAccount,
  payer: anchor.web3.PublicKey,
  mint: anchor.web3.Keypair,
  //connection: anchor.web3.Connection,
  beforeTransactions: Transaction[] = [],
  afterTransactions: Transaction[] = [],
  setupState?: SetupState
): Promise<MintResult | null> => {
  console.log("2nd mint",mint)
  const userTokenAccountAddress = (
    await getAtaForMint(mint.publicKey, payer)
  )[0];
  
  console.log("candymachine", candyMachine);
  
  const userPayingAccountAddress = candyMachine.state.tokenMint
    ? (await getAtaForMint(candyMachine.state.tokenMint, payer))[0]
    : payer;
  console.log("userPayingAccountAddress", userPayingAccountAddress);

  const candyMachineAddress = candyMachine.id;
  const remainingAccounts = [];
  const instructions = [];
  console.log("0st instructions", instructions);
  const signers: anchor.web3.Keypair[] = [];
  console.log("SetupState: ", setupState);
  console.log("candyMachineAddress: ", candyMachine.id);
  console.log("mintOneTrasnaction: beforeTransactions", beforeTransactions);
  console.log("mintOneTrasnaction: afterTransactions", afterTransactions);
  //signers.push(mint);
  if (!setupState) {
    signers.push(mint);
    console.log("Did we pass this?");
    instructions.push(
      ...[
        anchor.web3.SystemProgram.createAccount({
          fromPubkey: payer,
          newAccountPubkey: mint.publicKey,
          space: MintLayout.span,
          lamports:
            await candyMachine.program.provider.connection.getMinimumBalanceForRentExemption(
              MintLayout.span
            ),
          programId: TOKEN_PROGRAM_ID,
        }),
        Token.createInitMintInstruction(
          TOKEN_PROGRAM_ID,
          mint.publicKey,
          0,
          payer,
          payer
        ),
        createAssociatedTokenAccountInstruction(
          userTokenAccountAddress,
          payer,
          payer,
          mint.publicKey
        ),
        Token.createMintToInstruction(
          TOKEN_PROGRAM_ID,
          mint.publicKey,
          userTokenAccountAddress,
          payer,
          [],
          1
        ),
      ]
    );
  }
  console.log("1st set of instructions", instructions);

  if (candyMachine.state.gatekeeper) {
    console.log("candyMachine.state.gatekeeper", candyMachine.state.gatekeeper);
    remainingAccounts.push({
      pubkey: (
        await getNetworkToken(
          payer,
          candyMachine.state.gatekeeper.gatekeeperNetwork
        )
      )[0],
      isWritable: true,
      isSigner: false,
    });
    console.log("We successed on ramaining Accounts");
    if (candyMachine.state.gatekeeper.expireOnUse) {
      console.log("candyMachine.state.gatekeeper.expireOnUse", candyMachine.state.gatekeeper.expireOnUse)
      remainingAccounts.push({
        pubkey: CIVIC,
        isWritable: false,
        isSigner: false,
      });
      remainingAccounts.push({
        pubkey: (
          await getNetworkExpire(
            candyMachine.state.gatekeeper.gatekeeperNetwork
          )
        )[0],
        isWritable: false,
        isSigner: false,
      });
      console.log("We succe on expire on use");
    }
  }
  if (candyMachine.state.whitelistMintSettings) {
    console.log("candyMachine.state.whitelistMintSettings", candyMachine.state.whitelistMintSettings);
    const mint = new anchor.web3.PublicKey(
      candyMachine.state.whitelistMintSettings.mint
    );
    console.log("Mint one token", mint);
    const whitelistToken = (await getAtaForMint(mint, payer))[0];
    console.log("WhitelistToken", whitelistToken);
    remainingAccounts.push({
      pubkey: whitelistToken,
      isWritable: true,
      isSigner: false,
    });

    if (candyMachine.state.whitelistMintSettings.mode.burnEveryTime) {   
      console.log("candyMachine.state.whitelistMintSettings.mode.burnEveryTime", candyMachine.state.whitelistMintSettings.mode.burnEveryTime);
      remainingAccounts.push({
        pubkey: mint,
        isWritable: true,
        isSigner: false,
      });
      remainingAccounts.push({
        pubkey: payer,
        isWritable: false,
        isSigner: true,
      });
    }
  }

  console.log("2nd set of instructions", instructions);

  if (candyMachine.state.tokenMint) {
    console.log("candyMachine.state.tokenMint", candyMachine.state.tokenMint);
    remainingAccounts.push({
      pubkey: userPayingAccountAddress,
      isWritable: true,
      isSigner: false,
    });
    remainingAccounts.push({
      pubkey: payer,
      isWritable: false,
      isSigner: true,
    });
  }
  const metadataAddress = await getMetadata(mint.publicKey);
  const masterEdition = await getMasterEdition(mint.publicKey);

  const [candyMachineCreator, creatorBump] = await getCandyMachineCreator(
    candyMachineAddress
  );

  console.log("candyMachineCreator", candyMachineCreator);
  const freezePda = (await getFreezePda(candyMachineAddress))[0];
  console.log("FreezePda", freezePda.toString());
  console.log("candyMachine.program", candyMachine.program);
  console.log("3rd set of instructions", instructions);

  const freezePdaState = await getFreezePdaState(
    candyMachine.program,
    freezePda
  );

  console.log("Freeze state: ", freezePdaState);

  if (freezePdaState != null) {
    console.log("Freeze PDA state");
    remainingAccounts.push({
      pubkey: freezePda,
      isWritable: true,
      isSigner: false,
    });
    remainingAccounts.push({
      pubkey: userTokenAccountAddress,
      isWritable: false,
      isSigner: false,
    });
    if (candyMachine.state.tokenMint != null) {
      const freezeAta = (
        await getAtaForMint(candyMachine.state.tokenMint, freezePda)
      )[0];
      remainingAccounts.push({
        pubkey: freezeAta,
        isWritable: true,
        isSigner: false,
      });
    }
  }
  console.log("Remaining Accounts", remainingAccounts);
  console.log("RemainingAccounts", remainingAccounts.map((rm) => rm.pubkey.toBase58()));
  console.log("4th set of instructions", instructions);
  instructions.push(
    await candyMachine.program.instruction.mintNft(creatorBump, {
      accounts: {
        candyMachine: candyMachineAddress,
        candyMachineCreator,
        payer: payer,
        wallet: candyMachine.state.treasury,
        mint: mint.publicKey,
        metadata: metadataAddress,
        masterEdition,
        mintAuthority: payer,
        updateAuthority: payer,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        recentBlockhashes: SYSVAR_SLOT_HASHES_PUBKEY,
        instructionSysvarAccount: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      remainingAccounts:
        remainingAccounts.length > 0 ? remainingAccounts : undefined,
    })
  );
  console.log("Instructions in mint One Token", instructions);
  const [collectionPDA] = await getCollectionPDA(candyMachineAddress);
  const collectionPDAAccount =
    await candyMachine.program.provider.connection.getAccountInfo(
      collectionPDA
    );

  console.log("collectionPDAAccount ", collectionPDAAccount );
  console.log("candyMachine.state.retainAuthority ", candyMachine.state.retainAuthority);

  if (collectionPDAAccount && candyMachine.state.retainAuthority) {
    try {
      const collectionData =
        (await candyMachine.program.account.collectionPda.fetch(
          collectionPDA
        )) as CollectionData;
      console.log("collectionData", collectionData);
      const collectionMint = collectionData.mint;
      const collectionAuthorityRecord = await getCollectionAuthorityRecordPDA(
        collectionMint,
        collectionPDA
      );
      console.log("Collection Mint", collectionMint);
      if (collectionMint) {
        const collectionMetadata = await getMetadata(collectionMint);
        const collectionMasterEdition = await getMasterEdition(collectionMint);
        console.log("Collection PDA: ", collectionPDA.toBase58());
        console.log("Authority: ", candyMachine.state.authority.toBase58());
        instructions.push(
          await candyMachine.program.instruction.setCollectionDuringMint({
            accounts: {
              candyMachine: candyMachineAddress,
              metadata: metadataAddress,
              payer: payer,
              collectionPda: collectionPDA,
              tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
              instructions: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
              collectionMint,
              collectionMetadata,
              collectionMasterEdition,
              authority: candyMachine.state.authority,
              collectionAuthorityRecord,
            },
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  const instructionsMatrix = [instructions];
  const signersMatrix = [signers];
  console.log("signersMatrix", signersMatrix);
  console.log("instructionsMatrix", instructionsMatrix);

  try {
    console.log("A. candyMachine.program.provider.connection", candyMachine.program.provider.connection);
    console.log("B. candyMachine.program.provider.wallet", candyMachine.program.provider.wallet);
    console.log("C. instructionsMatrix",instructionsMatrix);
    console.log("D. signersMatrix", signersMatrix);
    console.log("E. SequenceType.StopOnFailure", SequenceType.StopOnFailure);
    console.log("F. singleGossip", "singleGossip");
    console.log("G. beforeTransactions", beforeTransactions);
    console.log("H. afterTransactions", afterTransactions);
    const txns = (
      await sendTransactions(
        candyMachine.program.provider.connection,
        candyMachine,
        instructionsMatrix,
        signersMatrix,
        SequenceType.StopOnFailure,
        "singleGossip",
        () => {},
        () => false,
        undefined,
        beforeTransactions,
        afterTransactions
      )
    ).txs.map((t) => t.txid);
    const mintTxn = txns[0];
    return {
      mintTxId: mintTxn,
      metadataKey: metadataAddress,
    };
    console.log("txns", txns);
  } catch (e) {
    console.log(e);
  }
  return null;
};

export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
