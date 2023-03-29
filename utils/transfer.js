var Web3 = require("web3");
var EventEmitter = require("events").EventEmitter;
var EthereumTx = require("ethereumjs-tx");
var BigNumber = require("bignumber.js");
var transferConfig = require("./../config/transfer");
var CErc20 = require("./../abis/CErc20.json");
var BatchTransfer = require("./../abis/BatchTransfer.json");
const web3 = new Web3(new Web3.providers.HttpProvider(transferConfig.RPC));
// const web3 = new Web3(
//   new Web3.providers.WebsocketProvider(transferConfig.WSSRPC)
// );
const batchAddress = transferConfig.batchAddress;
const erc20Address = transferConfig.erc20Address;
const batchContract = new web3.eth.Contract(BatchTransfer.abi, batchAddress);
const erc20Contract = new web3.eth.Contract(CErc20.abi, erc20Address);

var privateKey = Buffer.from(transferConfig.privateKey, "hex");
// const accountAddress = transferConfig.accountAddress;
async function sendSigned(txData, callback, privateKey) {
  var transaction = new EthereumTx(txData);
  transaction.sign(privateKey);
  const serializedTx = transaction.serialize().toString("hex");
  await web3.eth.sendSignedTransaction("0x" + serializedTx, callback);
}
// async function getBalance() {
//   const banlace = await web3.eth.getBalance(accountAddress);
//   console.log(banlace);
// }
async function approveTx() {
  var tx = await erc20Contract.methods.approve(
    batchAddress,
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  );
  var encodeABI = tx.encodeABI();
  return encodeABI;
}
async function transferERC20(address) {
  // var amountList = [];
  // transferConfig.transferInfo.amountList.forEach((item) => {
  //   amountList.push(new BigNumber(1e18).times(item).toFixed());
  // });
  // var tx = await batchContract.methods.transferERC20(
  //   transferConfig.transferInfo.addressList,
  //   amountList,
  //   erc20Address
  // );
  var tx = await batchContract.methods.transferERC20(
    [address],
    [new BigNumber(1e18).times(100).toFixed()],
    erc20Address
  );
  var encodeABI = tx.encodeABI();
  return encodeABI;
}
async function transferERC(addressList, amountList) {
  var tx = await batchContract.methods.transferETH(addressList, amountList);
  var encodeABI = tx.encodeABI();
  return encodeABI;
}
async function sendSignedTransaction(
  encodeABI,
  toAddress,
  privateKey,
  value,
  gas,
  fromAddress
) {
  let gasPrice = await web3.eth.getGasPrice();
  return new Promise(async (resolve, reject) => {
    try {
      console.log(fromAddress);
      web3.eth.getTransactionCount(fromAddress).then(async (txCount) => {
        var txData = {
          nonce: web3.utils.toHex(txCount),
          gasPrice: web3.utils.toHex(2 * 1e10),
          gasLimit: web3.utils.toHex(210000),
          from: fromAddress,
          to: toAddress,
          data: encodeABI,
        };
        // if (value) {
        //   txData.value = web3.utils.toHex(value);
        // }
        sendSigned(
          txData,
          async function (err, res) {
            if (!!err) {
              console.log(err, "err-----");
              return;
            }
            console.log(res, "tx-----");
            resolve(res);
          },
          privateKey
        );
      });
    } catch (error) {
      console.log(error);
      resolve(false);
    }
  });
}

async function approveToken() {
  const approveTxHash = await sendSignedTransaction(
    await approveTx(),
    erc20Address,
    privateKey,
    0,
    0,
    transferConfig.accountAddress
  );
  console.log(approveTxHash, "approveTxHash======");
  return approveTxHash;
}
async function transferToken(address) {
  const transferERC20TxHash = await sendSignedTransaction(
    await transferERC20(address),
    batchAddress,
    privateKey,
    0,
    0,
    transferConfig.accountAddress
  );
  return transferERC20TxHash;
}
async function transferETH(postData) {
  var totalValue = 0;
  postData.amountList.forEach((item) => {
    totalValue = new BigNumber(totalValue).plus(new BigNumber(item));
  });
  totalValue = totalValue.times(1e18).toFixed();
  var privateKey = Buffer.from(postData.privateKey, "hex");
  var amountList = [];
  postData.amountList.forEach((item) => {
    amountList.push(new BigNumber(1e18).times(item).toFixed());
  });
  // console.log(postData.addressList, amountList, "amountList======");
  const gas = await batchContract.methods
    .transferETH(postData.addressList, amountList)
    .estimateGas({
      from: postData.accountAddress,
      to: batchAddress,
      value: totalValue,
    });
  const transferERCTxHash = await sendSignedTransaction(
    await transferERC(postData.addressList, amountList),
    batchAddress,
    privateKey,
    totalValue,
    gas,
    postData.accountAddress
  );
  return transferERCTxHash;
}
// approveToken();
// transferToken();
module.exports = {
  // approveToken,
  transferToken,
  // transferETH,
};
