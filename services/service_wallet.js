
const Tx = require("@ethereumjs/tx").Transaction;
const Common = require("@ethereumjs/common").default;
const Web3 = require('web3-eth');
const web3_utils = require('web3-utils');

const web3 = new Web3("https://ropsten.infura.io/v3/f102be8166c24f62b31bd91ac2f1561e")
const contract_address = "0xa8594aa2757c9752ca0fe879985ee0ffa5ee8a54";
const contract_abi = require("../peaAbi.json");
const contract = new web3.Contract(contract_abi, contract_address);
const easyPease_wallet = "0x182fe03799a556F1fB67f4B814226B861E483aDF";
const easyPease_pk = Buffer.from("1aa9a4e99ce732e38fc9dd7a621ca8acf81156800728bbede2d30daaba8e85c5", "hex");
const txFees = 2;

const transferFrom = (address, amount, isFromServer, delegate) => {
  web3.getTransactionCount(easyPease_wallet, (err, txCount) => {
    const txObject = {
      nonce: web3_utils.toHex(txCount),
      gasLimit: web3_utils.toHex(800000),
      gasPrice: web3_utils.toHex(web3_utils.toWei("10", "gwei")),
      to: contract_address,
      data: isFromServer ? contract.methods.transferFrom(easyPease_wallet, address, amount, txFees).encodeABI() : contract.methods.transferFrom(address, easyPease_wallet, amount, 0).encodeABI(),
    };
    // Network data
    const commonObject = new Common({ chain: "ropsten", chainId: 3 });

    let tx = Tx.fromTxData(txObject, { common: commonObject });
    tx = tx.sign(easyPease_pk);
    tx = tx.serialize();

    const raw = "0x" + tx.toString("hex");
    web3.sendSignedTransaction(raw, (err, txHash) => {
      delegate(err, txHash);
    })
    .catch(err => {
      console.log("ERROR in tx " + err.receipt.transactionHash + ": " + err.message.split('\n')[0]);
    });
  });
}

const get_balance = (address, delegate) => {
  contract.methods.balanceOf(address).call((err, balance) => {
    delegate(err, balance);
  })
}

const create_wallet = () => {
  return web3.accounts.create(web3_utils.randomHex(32));
}

exports.transferFrom = transferFrom;
exports.get_balance = get_balance;
exports.create_wallet = create_wallet;