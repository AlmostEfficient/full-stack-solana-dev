# The Complete Guide to Full Stack Solana Development with React, Anchor, Rust, and Phantom

Don't learn to code, code to learn. 

This is a deep dive into the Solana stack -- everything from Rust programs, to React apps that the user hits. WIP - rewrite.

### Solana developer overview
If you've never used Solana and don't know what a blockchain is, I recommend [this crash course](https://www.youtube.com/watch?v=uH60e4gZBSY) to get you up to speed with the basics.

If any words or terms in this guide are confusing you, check out the [terminology](https://solana.com/docs/terminology) page on the Solana docs, they're pretty good!


## Project overview
We'll be building [WIP]
We'll be using [WIP]
Anchor - program framework/DSL
React - front-end framework + Solana Web3.js
Solana CLI - command line interface for interacting with Solana
wallet-adapter - library for connecting wallets to your app

### What you'll learn
- How to build a Solana program in Rust using Anchor
- Testing Anchor programs 
- Deploying to the Solana devnet
- Building a React app that interacts with Solana from scratch
- Connecting your React app to your Solana program

### Environment setup
To begin, you'll need to set up your environment. This guide assumes you're running MacOS or Linux. If you're on Windows, you'll need to install WSL and use that instead, [here's how](https://learn.microsoft.com/en-us/windows/wsl/install). 

Here's a list of the tools you'll need to have installed:
- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)
- [Rust](https://www.rust-lang.org/tools/install)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor](https://www.anchor-lang.com/docs/installation)

The best place to learn how to install is using their guides, which I've linked above. Once you have these installed, run this command:

```
rustc --version && solana --version && node -v && yarn --version && anchor --version
```
You should see a number of versions printed out. If you get an error, you'll need to install the missing tool. Windows users -- make sure you're running a WSL terminal, not a Windows terminal. 

If you haven't set up a Solana wallet yet, you can do that with:
```
solana-keygen new
```

You'll be prompted to enter a passphrase. This is the password you'll use to sign transactions and interact with your wallet. I only use my wallet for development, so I left mine blank.  

We'll need some Solana devnet tokens to pay for transactions. You can configure your wallet to the devnet and get some tokens with these commands:
```
solana config set --url devnet
solana airdrop 2
```

If this doesn't work, you can print out your wallet address with the `solana address` command and use the [Solana faucet](https://faucet.solana.com/) to get some tokens.

The last thing you'll need is a Solana browser wallet extension to interact with the web-app you build. I recommend [Phantom](https://phantom.app/). 


### Getting started

Phantom wallet

CLI/devnet setup
Get an airdrop
Alternate airdrop points
Recovering SOL for rent

Test validator
Using local explorer
Devnet



## Write and deploy a Solana program
### Set up an Anchor project

## Build a React client for your app
Now that your Solana program is live, you have several options for interacting with it. Any client you can think of will work - Node.js script, React app, mobile app, even a serverless function. We'll be building a React app for this guide.

### Set up your React project
There's a bunch of templates available for front-ends that give you everything you need. **We're not gonna use a template**. They often come with too much stuff added in and can be overwhelming. Instead, I'm gonna walk you through doing it yourself. This will help you understand what the templates are doing and show you how simple integrating Solana wallets is.

We'll be using [Vite](https://vitejs.dev/) because it comes with a lot less boilerplate than Next.js. Start by opening a new terminal window and creating a new vite project inside your workspace:

```
yarn create vite
```

Name it whatever you want (I've named mine `counter`). Select React as your framework and Typescript as the variant. Don't worry, we're not gonna be doing any fancy Typescript stuff!

If you're on Windows and using WSL, you'll need to update your `vite.config.ts` file so hot reloading works. Open it up and change it to this:
```
// WSL USERS ON WINDOWS ONLY (NOT NECESSARY FOR LINUX/MACOS)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
  },
})

```

Next, navigate into the front-end folder and run `yarn` to install all the dependencies:
```
cd counter
yarn
```

Your front-end is ready! Hit `yarn dev` and open up `http://localhost:5173/`.

### Create a connect wallet button 
We're not gonne be doing this bit from scratch, Solana has some really nice wallet adapter libraries that make adding wallets plug-n-play. You can even customize the styling! 

Throw this command into your terminal to install all the `wallet-adapter` stuff we need:
```
yarn add @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/web3.js react
```

Ready to see some magic happen? Open up your `counter/src/App.tsx` file and replace the code in there with this:
```tsx
import { useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import './App.css';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;
  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <h1>Hello Solana</h1>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
```

This is setup and config code taken from the [wallet-adapter docs](https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md). All we're doing here is bringing in the `wallet-adapter` imports, setting up a Solana network connection, and wrapping our app with the necessary context providers. 

Head back to `http://localhost:5173/` and you should see this:

![image](https://hackmd.io/_uploads/HJWI35ana.png)

We're ready to rumble!

P.S. you can change the app title in `index.html`.

### Reading from the blockchain
Ready to read from the blockchain? This is easier than you think!

First we need to build the layer that connects our deployed program with our front-end React app. We'll define what our program is and how to interact with it using the IDL.

Create a new folder named `anchor` in `counter/src` and copy over `target/counter/idl.json` (from the Anchor program) to a new file called `idl.ts`. We'll use the IDL to create Typescript objects that let us interact with our program. You'll need to append `export type Counter =` to the top of the file, followed by the contents of the `idl.json` file. Like this:

```ts
export type Counter = {
  "version": "0.1.0";

We'll need  Anchor to create the interfaces for the program, install it with:
```
yarn add  @coral-xyz/anchor
```

Now for the "connection layer" code. Create a `setup.ts` file in the `counter/src/anchor` folder and add this to it:
```ts
import { IdlAccounts, Program } from "@coral-xyz/anchor";
import { IDL, Counter } from "./idl";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const programId = new PublicKey("B2Sj5CsvGJvYEVUgF1ZBnWsBzWuHRQLrgMSJDjBU5hWA");
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Initialize the program interface with the IDL, program ID, and connection.
// This setup allows us to interact with the on-chain program using the defined interface.
export const program = new Program<Counter>(IDL, programId, {
  connection,
});

// To derive a PDA, we need:
// A seed - think of this like an ID or key (in a key-value store) 
// The program address of the program the PDA belongs to

// This gives us the mintPDA that we'll reference when minting stuff
export const [mintPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("mint")],
  program.programId
);

// Similarly, derive a PDA for when we increment the counter, using "counter" as the seed
export const [counterPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("counter")],
  program.programId
);

// This is just a TypeScript type for the Counter data structure based on the IDL
// We need this so TypeScript doesn't yell at us
export type CounterData = IdlAccounts<Counter>["counter"];
```

What we're doing here is using the interface to lay the groundwork for interacting with our program. We're generating the PDAs for the mint and counter accounts. We need these because anytime we send a Solana transaction, we have to specify all the accounts that will be changed by that transaction.

If we're minting a token, or changing the value of the counter, those accounts will change, and we need to include their addresses in the transaction. These are in their own file in`setup.ts` so we can access them in anywhere in our app. 

Make sure you remember to replace the PublicKey to the address of your program. Now that we have everything set up, we can READ!

Create a new directory `components` in `counter/src` and add a `counter-state.tsx` file in it with this code:

```ts
import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { program, counterPDA, CounterData } from "../anchor/setup";

export default function CounterState() {
  const { connection } = useConnection();
  const [counterData, setCounterData] = useState<CounterData | null>(null);

  useEffect(() => {
    // Fetch initial account data
    program.account.counter.fetch(counterPDA).then((data) => {
      setCounterData(data);
    });

    // Subscribe to account change
    const subscriptionId = connection.onAccountChange(
        // The address of the account we want to watch
      counterPDA,
        // callback for when the account changes
      (accountInfo) => {
        setCounterData(
          program.coder.accounts.decode("counter", accountInfo.data)
        );
      }
    );

    return () => {
      // Unsubscribe from account change
      connection.removeAccountChangeListener(subscriptionId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program]);

    // Render the value of the counter
  return <p className="text-lg">Count: {counterData?.count?.toString()}</p>;
}
```

Pretty straight-forward what's happening here. We use `program.account.counter.fetch(counterPDA)` to fetch the value of counter on load and then subscribe to any changes with `connection.onAccountChange`, which takes in a callback as the second value. The callback decodes the data we get back and sets it. EZPZ!

The final step is to add the component to our `App.tsx` file. Add this to the bottom of the file:
```ts
// ... previous imports
// Import the component we just created
import CounterState from "./components/counter-state";

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <h1>Hello Solana</h1>
          // ADD THIS LINE 
          <CounterState />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
```

Now if you open up `http://localhost:5173/` and you should see something like:
```
Count: 2
```

WOAH. WE JUST READ DATA FROM THE BLOCKCHAIN. Let's keep the momentum rolling by writing!

### Writing to the blockchain

Start by adding the `spl-token` library. We'll use this to get the associated token account address for the user's wallet.
```
yarn add @solana/spl-token 
```

The associated token account is where the user's tokens for this program are stored. We need this cause we're going to mint a token in the increment transaction.

Now to add increment functionality. We're going to put it all in a button component. Create a new file `components/increment-button.tsx` and add this code:

```tsx
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { program, mintPDA } from "../anchor/setup";

export default function IncrementButton() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    if (!publicKey) return;

    setIsLoading(true);

    try {
      const associatedTokenAccount = getAssociatedTokenAddressSync(
        mintPDA,
        publicKey
      );

      const transaction = await program.methods
        .increment()
        .accounts({
          user: publicKey,
          tokenAccount: associatedTokenAccount,
        })
        .transaction();

      const transactionSignature = await sendTransaction(
        transaction,
        connection
      );

      console.log(`View on explorer: https://solana.fm/tx/${transactionSignature}?cluster=devnet-alpha`);

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="w-24"
        onClick={onClick}
        disabled={!publicKey}
      >
        {isLoading ? "Loading" : "Increment"}
      </button>
    </>
  );
}
```

You know most of this code. The only new thing happening here is the transaction we're sending. We're using the `program.methods.increment()` method to create a transaction that increments the counter and mints our token. The accounts passed in are the user's wallet and the associated token account for the user's wallet.

Add this to to `App.tsx` to see the button:
```tsx
// ... previous imports
// Import the component we just created
import IncrementButton from "./components/increment-button";

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <h1>Hello Solana</h1>
          <CounterState />
          <IncrementButton />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
```

Load up `http://localhost:5173/` and you should see a button. Make sure you're connected to the [devnet](https://docs.phantom.app/introduction/developer-settings) on Phantom and and click the button. You should see the counter increment and the associated token account minted.

LET'S GOOOOOOOOOOOOOOOOOO. You did it! You are now a full-stack Solana developer.

## What now?
The world is yours for the taking. Anything you can imagine, you can create with Solana. 

- Join a Hackathon and get your hands dirty - https://solana.com/hackathon
- Pick a bounty and get some money - https://earn.superteam.fun/
- Build more advanced Solana apps - https://www.soldev.app/course
- Check out these templates - [solana-dapp-scaffold](https://github.com/solana-labs/dapp-scaffold), [create-solana-dapp](https://github.com/solana-developers/create-solana-dapp), [sample mobile apps](https://docs.solanamobile.com/sample-apps/sample_app_overview)

Whatever you make, share it with the world! Tag me on Twitter @almostefficient, it makes me happy seeing y'all build :)

Good luck!
