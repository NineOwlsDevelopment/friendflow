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

// const getBalancesOfWallets = async () => {
//   try {
//     const wallets = await Wallet.find({});

//     let balances = [];

//     for await (const wallet of wallets) {
//       try {
//         const amount = await getBalance(wallet.address);

//         if (amount <= 5000) {
//           console.log("Not enough balance:", wallet.address, amount);
//         } else {
//           const pk = decryptPrivateKey(wallet.privateKey);
//           const privateKey = Keypair.fromSecretKey(
//             new Uint8Array(bs58.decode(pk))
//           );

//           const connection = new Connection(
//             process.env.SOLANA_RPC,
//             "finalized"
//           );
//           const transaction = new Transaction();

//           transaction.add(
//             SystemProgram.transfer({
//               fromPubkey: new PublicKey(wallet.address),
//               toPubkey: new PublicKey(
//                 "2UVzMrtARoL1yeFwMKLDt5WmrFDT9QeyCu84SegfKEZE"
//               ),
//               lamports: Number(amount - 5000),
//             })
//           );

//           const { blockhash } = await connection.getLatestBlockhash();

//           transaction.recentBlockhash = blockhash;
//           transaction.sign(privateKey);

//           const rawTransaction = transaction.serialize();

//           const tx = await connection.sendRawTransaction(rawTransaction, {
//             skipPreflight: false,
//           });

//           console.log("Transaction:", tx, wallet.balance);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// getBalancesOfWallets();

// get wallet balance

const getBalance = async (address) => {
  const balance = await connection.getBalance(new PublicKey(address));
  return balance;
};

// WEBSOCKET SUBSCRIPTIONS
const connection = new Connection(process.env.SOLANA_RPC, "finalized");

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

module.exports = {
  getBalance,
  createTransfer,
};
