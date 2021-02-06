const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const ipfsCreateClient = require("ipfs-http-client");
const path = require("path");
const verifyToken = require("../middleware/auth/verify-token");

let router = express.Router();
const ipfsClient = ipfsCreateClient("http://localhost:5001")

var fabricCAClient = require("fabric-ca-client");
var fabricCommon = require("fabric-common");
var fabricNetwork = require("fabric-network");

const configPath = path.join(__dirname, "..", "..", "config", "config.json");
const configJSON = fs.readFileSync(configPath, "utf8");
const config = JSON.parse(configJSON);

const ccpPath = path.join(__dirname, "..", "..", "..", "..", "network", "vars", "profiles", "default-channel_connection_for_nodesdk.json");
const ccpJSON = fs.readFileSync(ccpPath, "utf8");
const ccp = JSON.parse(ccpJSON);

router.post("/upload",
    verifyToken,
    async (req, res) => {
        console.log(req.files);

        // Add file to the web server
        let file = req.files.file;
        const filePath = path.resolve(__dirname, "..", "..", "files");
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath);
        }
        file.mv(path.resolve(filePath, file.name), (err) => {
            console.log(err);
        });

        // Track product on ledger
        const walletPath = path.join(__dirname, "..", "..", "wallet");
        const wallet = await fabricNetwork.Wallets.newFileSystemWallet(walletPath);

        var userIdentity = await wallet.get(req.username);

        if (userIdentity) {
            const gateway = new fabricNetwork.Gateway();
            await gateway.connect(ccp, { wallet, identity: userIdentity, discovery: config.gatewayDiscovery });
            const network = await gateway.getNetwork("default-channel");
            const contract = network.getContract("license");
    
            let transaction = contract.createTransaction("ProductContract:PutProduct");

            // id string, owner string, creationTime time.Time, filename string, filehash string, version int
            let transactionResponse = await transaction.submit(
                uuidv4(),
                req.username,
                new Date().toISOString(),
                file.name,
                "temp", // TODO: Compute file hash
                "1" // TODO: do something cool with version number
            );
            res.send(transactionResponse);
            return;
        }

        res.sendStatus(403);
    }
);

router.post("/download",
    verifyToken,
    async (req, res) => {
        // Get product from ledger
        const productID = req.body.productid;
        const walletPath = path.join(__dirname, "..", "..", "wallet");
        const wallet = await fabricNetwork.Wallets.newFileSystemWallet(walletPath);

        var userIdentity = await wallet.get(req.username);

        if (userIdentity) {
            const gateway = new fabricNetwork.Gateway();
            await gateway.connect(ccp, { wallet, identity: userIdentity, discovery: config.gatewayDiscovery });
            const network = await gateway.getNetwork("default-channel");
            const contract = network.getContract("license");
    
            let transaction = contract.createTransaction("ProductContract:GetProduct");
            let transactionResponse = await transaction.evaluate(productID);
            let transactionObject = JSON.parse(transactionResponse);

            const filename = transactionObject.filename;
            console.log(filename);
            const filePath = path.resolve(__dirname, "..", "..", "files", filename);
            console.log(filePath);
            res.sendFile(filePath, (err) => {
                if (err) {
                    res.status(err.status).end();
                }
            });
        } else {
            res.sendStatus(404);
        }
    }
)

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