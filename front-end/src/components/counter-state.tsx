import {Program, AnchorProvider } from "@coral-xyz/anchor";
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {  counterPDA, CounterData } from "../anchor/setup";
import * as idl from "../anchor/counter.json";
import type { Counter } from "../anchor/counter";


export default function CounterState() {
  const { connection } = useConnection();
  const { wallet } = useWallet();
  const [counterData, setCounterData] = useState<CounterData | null>(null);

  useEffect(() => {
    if (!wallet) return;

    const provider = new AnchorProvider(connection,  {
      publicKey: wallet.adapter.publicKey,
      signTransaction: async (tx) => tx,
      signAllTransactions: async (txs) => txs,
    }, {
      commitment: "confirmed",
    });
    const program = new Program(idl as unknown as Counter, provider);

    program.account.counter.fetch(counterPDA).then((data) => {
      setCounterData(data);
    });
  }, [wallet, connection]);

  // Render the value of the counter
  return <p className="text-lg">Count: {counterData?.count?.toString()}</p>;
}