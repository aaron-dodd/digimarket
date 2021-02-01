const express = require("express");
let router = express.Router();

const fs = require("fs");
const path = require("path");

var fabricCAClient = require("fabric-ca-client");
var fabricCommon = require("fabric-common");
var fabricNetwork = require("fabric-network");

var verifyToken = require("../middleware/auth/verify-token");

var fcs = new fabricCAClient("https://localhost:7001");

const configPath = path.join(__dirname, "..", "..", "config", "config.json");
const configJSON = fs.readFileSync(configPath, "utf8");
const config = JSON.parse(configJSON);

const ccpPath = path.join(__dirname, "..", "..", "..", "..", "network", "vars", "profiles", "default-channel_connection_for_nodesdk.json");
const ccpJSON = fs.readFileSync(ccpPath, "utf8");
const ccp = JSON.parse(ccpJSON);

router.get("/query/all",
    verifyToken,
    async (req, res) => {
        console.log(req.username);

        const walletPath = path.join(__dirname, "..", "..", "wallet");
        console.log(walletPath);
        const wallet = await fabricNetwork.Wallets.newFileSystemWallet(walletPath);

        var userIdentity = await wallet.get(req.username);

        if (userIdentity) {
            const gateway = new fabricNetwork.Gateway();
            await gateway.connect(ccp, { wallet, identity: userIdentity, discovery: config.gatewayDiscovery });
            const network = await gateway.getNetwork("default-channel");
            const contract = network.getContract("simple");
    
            let transaction = contract.createTransaction("query");
            let transactionResponse = await transaction.evaluate("a");
            console.log(transactionResponse);
            res.send(transactionResponse);
        }

    }
);

router.post("/create",
    verifyToken,
    async (req, res) => {
    }
);

module.exports = router;