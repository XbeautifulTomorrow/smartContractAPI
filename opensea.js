var Web3 = require("web3");
var OpenSea = require("opensea-js");
var BigNumber = require("bignumber.js");

async function run() {
//   const provider = new Web3.providers.HttpProvider(
//     "https://goerli.blockpi.network/v1/rpc/public"
//   );
// const { OpenSeaSDK, Network } = OpenSea;
// const openseaSDK = new OpenSeaSDK(provider, {
//   networkName: Network.Goerli,
//   apiKey: YOUR_API_KEY,
// });
    const provider = new Web3.providers.HttpProvider(
    "https://ethereum.publicnode.com"
  );
  //api key
  const YOUR_API_KEY = "";
  const { OpenSeaSDK, Network } = OpenSea;
  const openseaSDK = new OpenSeaSDK(provider, {
    networkName: Network.Main,
    apiKey: YOUR_API_KEY,
  });
  //
  //opensea nft市场上的nft
  const asset = {
    tokenAddress: "0x495f947276749ce646f68ac8c248420045cb7b5e", 
    tokenId: "49444569059665029338110917543080762179844224043246484619351368868662498820097", // Token ID
    schemaName:"ERC1155"
  }
  //购买钱包地址
  const accountAddress = "0xB12e485b5A20692d455d294201f0411DC2B89d66"
  const  OpenSeaAsset = await openseaSDK.api.getAsset({
    tokenAddress:asset.tokenAddress, // string
    tokenId:asset.tokenId, // string | number | null
  })
  
  const  orders = await openseaSDK.api.getOrders({
    assetContractAddress: asset.tokenAddress,
    tokenId:asset.tokenId,
    side: "bid"
  })
  const offerData  ={
    asset:asset,
    accountAddress,
    startAmount: 0.004,
  };
  console.log(offerData,"offerData===")
  const offer = await openseaSDK.createBuyOrder(offerData)
  return;


  //自身钱包WETH数量
  const balanceOfWETH = await openseaSDK.getTokenBalance({
    accountAddress, // string
    tokenAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
  })
  

  console.log(orders,"orders==")
  //======开始报价
 

  console.log(offer, "provider===");
}
run();
