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
const privateKey =Buffer.from("1c7c9be239594a544bafbfd45b032e1cdabc9924cb7bf2048f91499ae050983c", "hex");
async function sendSigned(txData, callback, privateKey) {
    var transaction = new EthereumTx(txData);
    transaction.sign(privateKey);
    const serializedTx = transaction.serialize().toString("hex");
    await web3.eth.sendSignedTransaction("0x" + serializedTx, callback);
  }
async function getRandom() {
    
  // 调用 getRandomness 函数
  const nonce = await web3.eth.getTransactionCount(
    "0x1D882155812d665fEf948636e69b2a9Cb0724F2c"
  );
  const gasPrice = await web3.eth.getGasPrice();
  const gasPriceHex = await web3.utils.toHex(
    new BigNumber(gasPrice).times(1.2).toFixed(0)
  );
  const gasLimitHex = web3.utils.toHex("300000");
  const data = contract.methods
    .getRandomness("idStr", [1, 2, 3], "str")
    .encodeABI();
  const txParams = {
    nonce: nonce,
    from: "0x1D882155812d665fEf948636e69b2a9Cb0724F2c",
    to: contract.options.address,
    value: "0x00",
    gasPrice: gasPriceHex,
    gasLimit: gasLimitHex,
    data: data,
    chainId:5,
  };
var transaction = new EthereumTx(txParams);
transaction.sign(privateKey);
console.log(333,'return')
const serializedTx = transaction.serialize().toString("hex");
web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', console.log)

  
return;
  sendSigned(
    txParams,
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
  return;
  // 发送交易
  web3.eth
    .sendSignedTransaction("0x" + serializedTx.toString("hex"))
    .on("transactionHash", console.log)
    .on("error", console.error);

  // 订阅 "GetRandomness" 事件
  contract.events
    .GetRandomness()
    .on("data", (event) => {
      // 打印随机数和其他参数
      console.log(
        event.returnValues.idStr,
        event.returnValues.randomness,
        event.returnValues.str
      );
    })
    .on("error", console.error);
}
getRandom();
// async function test(){
//     var receipt = await web3.eth.getTransactionReceipt('0x0292d5234764c1334f419d22b36511f1eb553e48d4c3a8bc19f640cf7a823d5f')

//     console.log(web3.utils.toString(receipt.logs[0].data),"====")
//     contract.events.GetRandomness()
//     .on('data', event => {
//         // 打印随机数和其他参数
//         console.log(event.returnValues.idStr, event.returnValues.randomness, event.returnValues.str);
//     })
//     .on('error', console.error);
// }