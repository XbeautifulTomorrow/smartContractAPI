var BigNumber = require("bignumber.js");
var EventEmitter = require("events").EventEmitter;
var EthereumTx = require("ethereumjs-tx");
const Web3 = require("web3");
const web3 = new Web3("https://rpc.ankr.com/eth_goerli");
// 合约地址和 ABI
// const contractAddress = "0x537410d0357dd2b5ff0b5a66802440613ff1c236";
const contractAddress = "0x791fee024329647e246bca7f593d07ee381de819";
const contractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "idStrs",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "randomness",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "str",
        type: "string",
      },
    ],
    name: "GetRandomness",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "rounds",
    outputs: [
      {
        internalType: "string",
        name: "idStr",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "randomness",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "str",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "idStr",
        type: "string",
      },
      {
        internalType: "uint256[]",
        name: "arrayList",
        type: "uint256[]",
      },
      {
        internalType: "string",
        name: "str",
        type: "string",
      },
    ],
    name: "getRandomness",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
// 获取合约实例
const contract = new web3.eth.Contract(contractABI, contractAddress);
async function getRandom(postData) {
    console.log(postData,"postData=====")
    const address = postData.address;
    const key = postData.key;
  const privateKey = Buffer.from(key, "hex");
  // 调用 getRandomness 函数
  const nonce = await web3.eth.getTransactionCount(address);
  const gasPrice = await web3.eth.getGasPrice();
  const gasPriceHex = await web3.utils.toHex(
    new BigNumber(gasPrice).times(1.2).toFixed(0)
  );
  const gasLimitHex = web3.utils.toHex("300000");
  const data = contract.methods
    .getRandomness(postData.randomStr||"test", postData.randomArr, postData.randomHash||"Hash")
    .encodeABI();
  const txParams = {
    nonce: nonce,
    from: address,
    to: contract.options.address,
    value: "0x00",
    gasPrice: gasPriceHex,
    gasLimit: gasLimitHex,
    data: data,
    chainId: 5,
  };
  var transaction = new EthereumTx(txParams);
  transaction.sign(privateKey);
  const serializedTx = transaction.serialize().toString("hex");
  const tx = await web3.eth.sendSignedTransaction(
    "0x" + serializedTx.toString("hex"),
    function (e) {
      console.log(e, "===========");
    }
  );
  console.log(tx,"tx====")
  return tx;
  // .on("receipt", console.log);
}
console.log(333, "return");
module.exports = {
  getRandom,
};
