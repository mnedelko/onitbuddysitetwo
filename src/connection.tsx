/* eslint-disable */
import {
    Keypair,
    Commitment,
    Connection,
    RpcResponseAndContext,
    SignatureStatus,
    SimulatedTransactionResponse,
    Transaction,
    TransactionInstruction,
    TransactionSignature,
    Blockhash,
  } from "@solana/web3.js";
  
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { CandyMachineAccount } from "./candy-machine";
  
  export const DEFAULT_TIMEOUT = 60000;
  
  export const getErrorForTransaction = async (
    connection: Connection,
    txid: string
  ) => {
    // wait for all confirmation before geting transaction
    await connection.confirmTransaction(txid, "max");
  
    const tx = await connection.getParsedTransaction(txid);
  
    const errors: string[] = [];
    if (tx?.meta && tx.meta.logMessages) {
      tx.meta.logMessages.forEach((log) => {
        const regex = /Error: (.*)/gm;
        let m;
        while ((m = regex.exec(log)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
  
          if (m.length > 1) {
            errors.push(m[1]);
          }
        }
      });
    }
  
    return errors;
  };
  
  export enum SequenceType {
    Sequential,
    Parallel,
    StopOnFailure,
  }
  
  export async function sendTransactionsWithManualRetry(
    connection: Connection,
    wallet: any,
    instructions: TransactionInstruction[][],
    signers: Keypair[][]
  ): Promise<(string | undefined)[]> {
    let stopPoint = 0;
    let tries = 0;
    let lastInstructionsLength = null;
    const toRemoveSigners: Record<number, boolean> = {};
    instructions = instructions.filter((instr, i) => {
      if (instr.length > 0) {
        return true;
      } else {
        toRemoveSigners[i] = true;
        return false;
      }
    });
    let ids: string[] = [];
    let filteredSigners = signers.filter((_, i) => !toRemoveSigners[i]);
  
    while (stopPoint < instructions.length && tries < 3) {
      instructions = instructions.slice(stopPoint, instructions.length);
      filteredSigners = filteredSigners.slice(stopPoint, filteredSigners.length);
  
      if (instructions.length === lastInstructionsLength) tries = tries + 1;
      else tries = 0;
  
      try {
        if (instructions.length === 1) {
          const id = await sendTransactionWithRetry(
            connection,
            wallet,
            instructions[0],
            filteredSigners[0],
            "single"
          );
          ids.push(id.txid);
          stopPoint = 1;
        } else {
          const { txs } = await sendTransactions(
            connection,
            wallet,
            instructions,
            filteredSigners,
            SequenceType.StopOnFailure,
            "single"
          );
          ids = ids.concat(txs.map((t) => t.txid));
        }
      } catch (e) {
        console.error(e);
      }
      console.log(
        "Died on ",
        stopPoint,
        "retrying from instruction",
        instructions[stopPoint],
        "instructions length is",
        instructions.length
      ); 
      lastInstructionsLength = instructions.length;
    }
  
    return ids;
  }
  
  export const sendTransactions = async (
    connection: Connection,
    candymachine: CandyMachineAccount,
    instructionSet: TransactionInstruction[][],
    signersSet: Keypair[][],
    sequenceType: SequenceType = SequenceType.Parallel,
    commitment: Commitment = "singleGossip",
    successCallback: (txid: string, ind: number) => void = (txid, ind) => {},
    failCallback: (reason: string, ind: number) => boolean = (txid, ind) => false,
    blockhash?: Blockhash,
    beforeTransactions: Transaction[] = [],
    afterTransactions: Transaction[] = []
  ): Promise<{ number: number; txs: { txid: string; slot: number }[] }> => {
    if (!candymachine.program.provider.wallet.publicKey) throw new WalletNotConnectedError();
    console.log("signersSet",signersSet);
    const unsignedTxns: Transaction[] = beforeTransactions;
  
    if (!blockhash) {
      blockhash = (await connection.getLatestBlockhash(commitment)).blockhash;
    }
  
    for (let i = 0; i < instructionSet.length; i++) {
      console.log("instructionSet[i]",instructionSet[i]);
      const instructions = instructionSet[i];
      const signers = signersSet[i];
  
      if (instructions.length === 0) {
        continue;
      }
      console.log("Signers", signers);
      console.log("Instructions", instructions);
      const transaction = new Transaction();
      instructions.forEach((instruction) => transaction.add(instruction));
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = candymachine.program.provider.wallet.publicKey;
      // transaction.setSigners(
      //   // fee payed by the wallet owner
      //   candymachine.program.provider.wallet.publicKey,
      //   ...signers.map(s => s.publicKey),
      // );
      console.log("Transaction Output", transaction);
  
      if (signers.length > 0) {
        transaction.partialSign(...signers);
      }
  
      unsignedTxns.push(transaction);
    }
    console.log("afterTransaction before", afterTransactions);
    unsignedTxns.push(...afterTransactions);
    console.log("afterTransaction after", afterTransactions);
  
    //This is where we left
    console.log("unsignedTxns", JSON.stringify(unsignedTxns));
    console.log("JSONStringyfy unsignedTxns.signatures", JSON.stringify(unsignedTxns[0], ["signatures"]));
    console.log("JSONStringyfy unsignedTxns[0]", JSON.stringify(unsignedTxns[0]));
    console.log("unsignedTxns[0]", unsignedTxns[0]);

    // if (
    //   unsignedTxns.length <= 1 
    // ){
    //   const test = unsignedTxns[0].signatures[0].publicKey;
    //   console.log("This is a test", test);
    // } else {
    //   const test = unsignedTxns[0].signatures.find((sig)=> sig.publicKey.equals(candymachine.program.provider.wallet.publicKey));
    //   console.log("This is a testly", test);
    // }

    // const test = unsignedTxns[0].signatures.find((sig)=> sig.publicKey.equals(candymachine.program.provider.wallet.publicKey));
    // console.log("This is a testly", test);

    console.log("wallet.publiKey", candymachine.program.provider.wallet.publicKey);

    const partiallySignedTransactions = unsignedTxns.filter(t =>
      t.signatures.find(sig => sig.publicKey.equals(candymachine.program.provider.wallet.publicKey)));
    
      //const partiallySignedTransactions = unsignedTxns[0].signatures.find((sig) => sig.publicKey.equals(wallet.publicKey));
    
    console.log("partiallySignedTransactions", JSON.stringify(partiallySignedTransactions));
    
    console.log("wallet.publicKey", candymachine.program.provider.wallet.publicKey);
    //need to revisit this also
    
    const fullySignedTransactions= unsignedTxns.filter(
        (t) => !t.signatures.find((sig) => sig.publicKey.equals(candymachine.program.provider.wallet.publicKey)));
    
        console.log("fullySignedTransactions", fullySignedTransactions);
    //HERE is where we left off
    let signedTxns = await candymachine.program.provider.wallet.signAllTransactions(
        partiallySignedTransactions,
    );
    console.log("signedTxns1", signedTxns);
    signedTxns = fullySignedTransactions.concat(signedTxns);
    console.log("signedTxns2", signedTxns);
    const pendingTxns: Promise<{ txid: string; slot: number }>[] = [];
    console.log("pendingTxns", pendingTxns);
      console.log(
        "Signed txns length",
        signedTxns.length,
        "vs handed in length",
        instructionSet.length
    );

    console.log("connection", connection);
    console.log("signedTxns", signedTxns);
    console.log("signedTxns[0]", signedTxns[0]);

    for (let i = 0; i < signedTxns.length; i++) {
      console.log("SignedTxns increments", signedTxns[i]);
      const signedTxnPromise = sendSignedTransaction({
        connection,
        signedTransaction: signedTxns[i],
      });

      console.log("signedTxnPromise", await signedTxnPromise);
  
      if (sequenceType !== SequenceType.Parallel) {
        try {
          await signedTxnPromise.then(({ txid, slot }) =>
            successCallback(txid, i)
        );
        pendingTxns.push(signedTxnPromise);
        } catch (e) {
          console.log("Failed at txn index:", i);
          console.log("Caught failure:", e);

          failCallback(signedTxns[i].serialize.toString(), i);
          if (sequenceType === SequenceType.StopOnFailure) {
            return {
              number: i,
              txs: await Promise.all(pendingTxns),
            };
          }
        }
      } else {
        pendingTxns.push(signedTxnPromise);
      }
    }
  
    if (sequenceType !== SequenceType.Parallel) {
      const result = await Promise.all(pendingTxns);
      return { number: signedTxns.length, txs: result };
    }
  
    return { number: signedTxns.length, txs: await Promise.all(pendingTxns) };
  };
  
  export const sendTransaction = async (
    connection: Connection,
    wallet: any,
    instructions: TransactionInstruction[] | Transaction,
    signers: Keypair[],
    awaitConfirmation = true,
    commitment: Commitment = "singleGossip",
    includesFeePayer: boolean = false,
    blockhash?: Blockhash
  ) => {
    if (!wallet.publicKey) throw new WalletNotConnectedError();
  
    let transaction: Transaction;
    if (!Array.isArray(instructions)) {
      transaction = instructions;
    } else {
      transaction = new Transaction();
      instructions.forEach((instruction) => transaction.add(instruction));

      transaction.recentBlockhash = 
        blockhash || (await connection.getLatestBlockhash(commitment)).blockhash;
    if (includesFeePayer) {
      transaction.feePayer = signers[0].publicKey;
    } else {
      transaction.feePayer = wallet.publicKey;
    }
    if (signers.length > 0) {
      transaction.partialSign(...signers);
    }
    if (!includesFeePayer) {
      transaction = await wallet.signTransaction(transaction);
    }
  }  

  const rawTransaction = transaction.serialize();
  const options = {
      skipPreflight: true,
      commitment,
    };
  
  const txid = await connection.sendRawTransaction(rawTransaction, options);
  console.log("TXID", txid);
  let slot = 0;

  if (awaitConfirmation) {
    const confirmation = await awaitTransactionSignatureConfirmation(
      txid,
      DEFAULT_TIMEOUT,
      connection,
      commitment
    );
  
    if (!confirmation)
      throw new Error("Timed out awaiting confirmation on transaction");
    slot = confirmation?.slot || 0;

    if (confirmation?.err) {
      const errors = await getErrorForTransaction(connection, txid);

      console.log(errors);
      throw new Error(`Raw transaction ${txid} failed`);
    }
  }
  
    return { txid, slot };
  };
  
  export const sendTransactionWithRetry = async (
    connection: Connection,
    wallet: any,
    instructions: TransactionInstruction[],
    signers: Keypair[],
    commitment: Commitment = "singleGossip",
    includesFeePayer: boolean = false,
    blockhash?: Blockhash,
    beforeSend?: () => void
  ) => {
    if (!wallet.publicKey) throw new WalletNotConnectedError();
  
    let transaction = new Transaction();
    instructions.forEach((instruction) => transaction.add(instruction));
    transaction.recentBlockhash =
      blockhash || (await connection.getLatestBlockhash(commitment)).blockhash;    
    if (includesFeePayer) {
      transaction.feePayer = signers[0].publicKey;
    } else {
      transaction.feePayer = wallet.publicKey;
    }
  
    if (signers.length > 0) {
      transaction.partialSign(...signers);
    }
    if (!includesFeePayer) {
      transaction = await wallet.signTransaction(transaction);
    }

    if (beforeSend) {
      beforeSend();
    }
  
    const { txid, slot } = await sendSignedTransaction({
      signedTransaction: transaction,
      connection,
    });
  
    return { txid, slot };
  };
  
  export const getUnixTs = () => {
    return new Date().getTime() / 1000;
  };
  
  export async function sendSignedTransaction({
    signedTransaction,
    connection,
    timeout = DEFAULT_TIMEOUT,
  }: {
    signedTransaction: Transaction;
    connection: Connection;
    sendingMessage?: string;
    sentMessage?: string;
    successMessage?: string;
    timeout?: number;
  }): Promise<{ txid: string; slot: number }> {
    const rawTransaction = signedTransaction.serialize();
    console.log("rawTransaction", rawTransaction);
    console.log("timeout", timeout);

    const startTime = getUnixTs();
    let slot = 0;
    console.log("slot", slot);
    const txid: TransactionSignature = await connection.sendRawTransaction(
      rawTransaction,
      {
        skipPreflight: true,
      }
    );
  
    console.log("Started awaiting confirmation for", txid);
  
    let done = false;
    (async () => {
      while (!done && getUnixTs() - startTime < timeout) {
        connection.sendRawTransaction(rawTransaction, {
          skipPreflight: true,
        });
        await sleep(500);
      }
    })();
    try {
      const confirmation = await awaitTransactionSignatureConfirmation(
        txid,
        timeout,
        connection,
        "recent",
        true
      );
  
      if (!confirmation)
        throw new Error("Timed out awaiting confirmation on transaction");
  
      if (confirmation.err) {
        console.error(confirmation.err);
        throw new Error("Transaction failed: Custom instruction error");
      }
  
      slot = confirmation?.slot || 0;
    } catch (err: any) {
      console.error("Timeout Error caught", err);
      if (err.timeout) {
        throw new Error("Timed out awaiting confirmation on transaction");
      }
      let simulateResult: SimulatedTransactionResponse | null = null;
      try {
        simulateResult = (
          await simulateTransaction(connection, signedTransaction, "single")
        ).value;
      } catch (e) {}
      if (simulateResult && simulateResult.err) {
        if (simulateResult.logs) {
          for (let i = simulateResult.logs.length - 1; i >= 0; --i) {
            const line = simulateResult.logs[i];
            if (line.startsWith("Program log: ")) {
              throw new Error(
                "Transaction failed: " + line.slice("Program log: ".length)
              );
            }
          }
        }
        throw new Error(JSON.stringify(simulateResult.err));
      }
      // throw new Error('Transaction failed');
    } finally {
      done = true;
    }
  
    console.log("Latency", txid, getUnixTs() - startTime);
    return { txid, slot };
  }
  
  async function simulateTransaction(
    connection: Connection,
    transaction: Transaction,
    commitment: Commitment
  ): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> {
    // @ts-ignore
    transaction.recentBlockhash = await connection._recentBlockhash(
      // @ts-ignore
      connection._disableBlockhashCaching
    );
  
    const signData = transaction.serializeMessage();
    // @ts-ignore
    const wireTransaction = transaction._serialize(signData);
    const encodedTransaction = wireTransaction.toString("base64");
    const config: any = { encoding: "base64", commitment };
    const args = [encodedTransaction, config];
  
    // @ts-ignore
    const res = await connection._rpcRequest("simulateTransaction", args);
    if (res.error) {
      throw new Error("failed to simulate transaction: " + res.error.message);
    }
    return res.result;
  }
  
  async function awaitTransactionSignatureConfirmation(
    txid: TransactionSignature,
    timeout: number,
    connection: Connection,
    commitment: Commitment = "recent",
    queryStatus = false
  ): Promise<SignatureStatus | null | void> {
    let done = false;
    let status: SignatureStatus | null | void = {
      slot: 0,
      confirmations: 0,
      err: null,
    };
    let subId = 0;
    status = await new Promise(async (resolve, reject) => {
      setTimeout(() => {
        if (done) {
          return;
        }
        done = true;
        console.log("Rejecting for timeout...");
        reject({ timeout: true });
      }, timeout);
      try {
        subId = connection.onSignature(
          txid,
          (result, context) => {
            done = true;
            status = {
              err: result.err,
              slot: context.slot,
              confirmations: 0,
            };
            if (result.err) {
              console.log("Rejected via websocket", result.err);
              reject(status);
            } else {
              console.log("Resolved via websocket", result);
              resolve(status);
            }
          },
          commitment
        );
      } catch (e) {
        done = true;
        console.error("WS error in setup", txid, e);
      }
      while (!done && queryStatus) {
        // eslint-disable-next-line no-loop-func
        (async () => {
          try {
            const signatureStatuses = await connection.getSignatureStatuses([
              txid,
            ]);
            status = signatureStatuses && signatureStatuses.value[0];
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
  }
  export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  