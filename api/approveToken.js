var express = require("express");
var router = express.Router();
const transfer = require("../utils/transfer");
router.get("/", async function (req, res, next) {
  const tx = await transfer.approveToken();
  res.json({ txHash: tx });
});
module.exports = router;
