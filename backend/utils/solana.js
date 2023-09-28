const {
  PublicKey,
  Connection,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");
const WebSocket = require("ws");
const Wallet = require("../models/Wallet");
const User = require("../models/User");
const bs58 = require("bs58");

const { decryptPrivateKey } = require("./cipher");

const connection = new Connection(process.env.SOLANA_RPC, "confirmed");

const ws = new WebSocket(process.env.SOLANA_RPC_WS);

// get wallet balance
const getBalance = async (address) => {
  const balance = await connection.getBalance(new PublicKey(address));
  return balance;
};

// subscribe to account changes
const subscribeAccountChanges = async (address) => {
  const publicKey = new PublicKey(address);

  connection.accountSubscribe(publicKey, "confirmed", (accountInfo) => {
    console.log(accountInfo);
  });

  console.log(account);

  return account;
};

const createTransfer = async (from, recipients) => {
  try {
    const pk = decryptPrivateKey(from.privateKey);
    const privateKey = Keypair.fromSecretKey(new Uint8Array(bs58.decode(pk)));

    const transaction = new Transaction();

    for await (const recipient of recipients) {
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(from.address),
          toPubkey: new PublicKey(recipient.address),
          lamports: Number(recipient.amount),
        })
      );
    }

    const connection = new Connection(process.env.SOLANA_RPC);

    const { blockhash } = await connection.getRecentBlockhash();

    transaction.recentBlockhash = blockhash;
    transaction.sign(privateKey);
    const rawTransaction = transaction.serialize();

    return await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: false,
    });
  } catch (error) {
    console.log(error);
  }
};

// const wallets = [
//   "6XBfNuoEcpsJxaGEEZBTWP9KCfBFWcVbJvVHghVoUcKz",
//   "Dbvoo15mdkQr9S2MBVasfjP75jMuLBfftayVmNdbeDjh",
// ];

const subscriptions = new Map();

const addNewWalletSubscription = async (address) => {
  const subscriptionRequest = {
    jsonrpc: "2.0",
    id: address,
    method: "accountSubscribe",
    params: [
      address,
      {
        encoding: "jsonParsed",
        commitment: "finalized",
      },
    ],
  };

  ws.send(JSON.stringify(subscriptionRequest));
};

ws.on("open", async () => {
  try {
    console.log("WebSocket connection is open ...");

    const wallets = await Wallet.find({});

    for await (const wallet of wallets) {
      const address = wallet.address;
      addNewWalletSubscription(address);
    }
  } catch (error) {
    console.log(error);
  }
});

ws.on("message", async (data) => {
  try {
    const notification = JSON.parse(data);

    if (notification.id) {
      const wallet = notification.id;
      const subscription = notification.result;

      subscriptions.set(subscription, wallet);

      return;
    }

    const amount = notification.params?.result.value.lamports;
    const subscription = notification.params?.subscription;
    const walletMap = subscriptions.get(subscription);

    console.log("Wallet:", walletMap);
    console.log("Amount:", amount);
    console.log("Subscription #:", subscription);

    const wallet = await Wallet.findOne({ address: walletMap });

    if (!wallet) return;

    wallet.balance = amount;

    await wallet.save();
  } catch (error) {
    console.log(error);
  }
});

ws.on("close", () => {
  console.log("WebSocket connection is closed");
});

module.exports = {
  getBalance,
  subscribeAccountChanges,
  createTransfer,
};
