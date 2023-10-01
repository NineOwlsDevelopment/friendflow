const { Keypair } = require("@solana/web3.js");
const crypto = require("crypto");
const bs58 = require("bs58");

const encryptPrivateKey = (privateKey) => {
  try {
    const iv = Buffer.from(process.env.IV_KEY, "hex");
    const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
    const cipher = crypto.createCipheriv(process.env.ALGO, encryptionKey, iv);

    let encryptedPrivateKey = cipher.update(privateKey, "utf8", "hex");
    encryptedPrivateKey += cipher.final("hex");

    return encryptedPrivateKey;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const generateKeypair = () => {
  try {
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toString();
    const privateKey = bs58.encode(keypair.secretKey);

    const encryptedPrivateKey = encryptPrivateKey(privateKey);

    return { publicKey, encryptedPrivateKey };
  } catch (err) {
    console.log(err);
    return null;
  }
};

const decryptPrivateKey = (encryptedPrivateKey) => {
  try {
    const iv = Buffer.from(process.env.IV_KEY, "hex");
    const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
    const decipher = crypto.createDecipheriv(
      process.env.ALGO,
      encryptionKey,
      iv
    );

    let decryptedPrivateKey = decipher.update(
      encryptedPrivateKey,
      "hex",
      "utf8"
    );

    decryptedPrivateKey += decipher.final("utf8");

    return decryptedPrivateKey;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = {
  encryptPrivateKey,
  generateKeypair,
  decryptPrivateKey,
};
