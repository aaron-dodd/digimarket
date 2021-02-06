const express = require("express");
const ipfsCreateClient = require("ipfs-http-client");
const verifyToken = require("../middleware/auth/verify-token");

let router = express.Router();
const ipfsClient = ipfsCreateClient("http://localhost:5001")

router.post("/upload", (req, res) => {
    console.log(req.files);
    res.sendStatus(200);
});

router.get("/file/:cid", async (req, res) => {
    console.log(req.params.cid);
    var content = [];

    for await (const file of ipfsClient.get(req.params.cid)) {
        console.log(file.type, file.path)
      
        if (!file.content) continue;
      
        const content = []
      
        for await (const chunk of file.content) {
          content.push(chunk)
        }
      
        console.log(content)
        res.send(content.data);
      }
})

module.exports = router;