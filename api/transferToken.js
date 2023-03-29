var express = require("express");
var router = express.Router();
const transfer = require("../utils/transfer");
router.post("/", async function (req, res, next) {
  const postData = req.body;
  const tx = await transfer.transferToken(postData.address);
  res.json({ msg: tx });
});
module.exports = router;
