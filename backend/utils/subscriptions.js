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
const Deposit = require("../models/Deposit");
const bs58 = require("bs58");

const { decryptPrivateKey } = require("./cipher");
const { connect } = require("mongoose");

let ws = new WebSocket(process.env.SOLANA_RPC_WS, {
  perMessageDeflate: false,
  commitment: "finalized",
  keepAlive: true,
});

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

const connectWebSocket = async () => {
  //   ws = new WebSocket(process.env.SOLANA_RPC_WS, {
  //     perMessageDeflate: false,
  //     commitment: "finalized",
  //   });

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

      if (!amount || amount === 0) {
        return console.log("No amount");
      }

      const subscription = notification.params?.subscription;
      const walletMap = subscriptions.get(subscription);

      console.log("Wallet:", walletMap);
      console.log("Amount:", amount);
      console.log("Subscription #:", subscription);

      const wallet = await Wallet.findOne({ address: walletMap });

      if (!wallet) return;

      const pk = decryptPrivateKey(wallet.privateKey);
      const privateKey = Keypair.fromSecretKey(new Uint8Array(bs58.decode(pk)));

      const connection = new Connection(process.env.SOLANA_RPC, "finalized");

      const transaction = new Transaction();

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(wallet.address),
          toPubkey: new PublicKey(process.env.HOT_WALLET_ADDRESS),
          lamports: Number(amount - 5000),
        })
      );

      const amountMinusFee = amount - 5000;

      const { blockhash } = await connection.getLatestBlockhash();

      transaction.recentBlockhash = blockhash;
      transaction.sign(privateKey);

      const rawTransaction = transaction.serialize();

      const tx = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: false,
      });

      const deposit = new Deposit({
        user: wallet.user,
        amount: amountMinusFee,
        txid: tx,
      });

      wallet.balance = wallet.balance + amountMinusFee;

      console.log("Transaction:", tx, wallet.balance);

      await wallet.save();
      await deposit.save();
    } catch (error) {
      console.log(error);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection is closed");
  });
};

connectWebSocket();

module.exports = {
  addNewWalletSubscription,
};
