var express = require("express");
var router = express.Router();
const random = require("../utils/random");
router.post("/", async function (req, res, next) {
    const postData = req;
    console.log(postData.query)
    // const tx = "1234";
    const tx = await random.getRandom(postData.query);
    res.json({ txInfo: tx });
  });
module.exports = router;
