const express = require("express");
let router = express.Router();
const fs = require("fs");
const path = require("path");

var verifyToken = require("../middleware/auth/verify-token");

const configPath = path.join(__dirname, "..", "..", "config", "config.json");
const configJSON = fs.readFileSync(configPath, "utf8");
const config = JSON.parse(configJSON);

const ccpPath = path.join(__dirname, "..", "..", "..", "..", "network", "vars", "profiles", "default-channel_connection_for_nodesdk.json");
const ccpJSON = fs.readFileSync(ccpPath, "utf8");
const ccp = JSON.parse(ccpJSON);

router.post("/verify",
    async (req, res) => {
        const licenseKey = req.body.licensekey;

        const walletPath = path.join(__dirname, "..", "..", "wallet");
        const wallet = await fabricNetwork.Wallets.newFileSystemWallet(walletPath);

        var identity = await wallet.get(config.adminUsername);

        if (identity) {
            const gateway = new fabricNetwork.Gateway();
            await gateway.connect(ccp, { wallet, identity: identity, discovery: config.gatewayDiscovery });
            const network = await gateway.getNetwork("default-channel");
            const contract = network.getContract("license");
    
            let transaction = contract.createTransaction("VerificationContract:VerifyLicense");
            let transactionResponse = await transaction.evaluate(licenseKey);
            res.send(transactionResponse);
            return;
        }

        res.sendStatus(403);
    }
)

module.exports = router;