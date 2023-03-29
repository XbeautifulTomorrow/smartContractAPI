var express = require("express");
var router = express.Router();
const transfer = require("../utils/transfer");
router.post("/", async function (req, res, next) {
  const postData = req.body;
  const tx = await transfer.transferETH(postData);
  res.json({ txHash: tx });
});
module.exports = router;
