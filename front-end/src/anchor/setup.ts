import { IdlAccounts, Program  } from "@coral-xyz/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import * as idl from "./counter.json";
import type { Counter } from "./counter";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const program = new Program(idl as unknown as Counter, {
  connection,
} );

export const [counterPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("counter")],
  new PublicKey("EvDoy5PvRxvE5i9TJzj63Hmf5toV9xUZARREcQjzZY9X")
);

export type CounterData = IdlAccounts<Counter>["counter"];