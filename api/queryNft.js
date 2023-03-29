var express = require("express");
var axios = require("axios");
var lodash = require("lodash");
var router = express.Router();
const transfer = require("../utils/transfer");
const tokenConfig = require("../config/token");
const chainId = {
  1: "https://api.opensea.io/api/v1/asset/",
  137: "https://api.opensea.io/api/v1/asset/",
  4: "https://testnets-api.opensea.io/asset/",
  80001: "https://testnets-api.opensea.io/asset/",
};
router.post("/", async function (req, res, next) {
  const postData = req.body;
  const openseaNft = await axios
    .get(
      chainId[postData.chain_id] + postData.address + "/" + postData.token_id
    )
    .catch((err) => {
      console.log(err, "nft-------err");
    });
  if (lodash.isEmpty(openseaNft)) {
    res.json({ msg: "Not Fund" });
    return;
  }
  const nftData = openseaNft.data;
  let newData = {
    token_id: nftData.token_id,
    image_url: nftData.image_url,
    animation_url: nftData.animation_url,
    name: nftData.name,
    description: nftData.description,
    traits: nftData.traits,
    creator: nftData.creator.address,
    schema_name: nftData.asset_contract.schema_name,
  };
  if (lodash.has(openseaNft.data, "orders")) {
    newData.orders = {
      payment_token: nftData.orders[0].payment_token,
      payment_symbol:
        tokenConfig[postData.chain_id][nftData.orders[0].payment_token].symbol,
      base_price: nftData.orders[0].base_price,
      price_decimal:
        tokenConfig[postData.chain_id][nftData.orders[0].payment_token].decimal,
    };
  }
  res.json({ msg: newData });
});
module.exports = router;
