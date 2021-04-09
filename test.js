const {
  sponsorTransaction,
  BufferReader,
  deserializeTransaction,
  broadcastTransaction,
} = require("@stacks/transactions");
const { StacksTestnet, StacksMainnet } = require("@stacks/network");
const BigNum = require("bn.js");

async function test() {
  const txRaw =
    "0x8080000000050005494b65f898b2d9d6065d3d59e26e49266f1b36000000000000000200000000000000000001e88a5dbd8d71219824e032cd84a35b0d5c7def42f140534ad4a432906103ff8d5e313ae45de00d6caf2b6aade85f4398e692d5feac207a83b5ed5ee8be8ebc470029cfc6376255a78451eeb4b129ed8eacffa2feef00000000000000000000000000000108000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030200000000021a04d17b3dcd5fbec9bcf7c97e4b6beb0a907738d908737761672d3130300a636c61696d2d7377616700000000";
  const txBuffer = Buffer.from(txRaw.replace(/^0x/, ""), "hex");
  const deserializedTx = deserializeTransaction(new BufferReader(txBuffer));
  const sponsorKey = process.env.SPONSOR_PRIVATE_KEY;
  const fee = new BigNum(1000);

  const sponsorOptions = {
    transaction: deserializedTx,
    sponsorPrivateKey: sponsorKey,
    fee,
  };

  const sponsoredTx = await sponsorTransaction(sponsorOptions);

  // for mainnet, use `StacksMainnet()`
  const network = new StacksTestnet();
  const resp = await broadcastTransaction(sponsoredTx, network);

  console.log(resp);
}

test();
