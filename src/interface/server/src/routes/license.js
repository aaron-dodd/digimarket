const express = require("express");
let router = express.Router();
const fs = require("fs");
const path = require("path");

const ipfsCreateClient = require("ipfs-http-client");
const ipfsClient = ipfsCreateClient("http://localhost:5001/");

var verifyToken = require("../middleware/auth/verify-token");

var fabricCAClient = require("fabric-ca-client");
var fabricCommon = require("fabric-common");
var fabricNetwork = require("fabric-network");

const configPath = path.join(__dirname, "..", "..", "config", "config.json");
const configJSON = fs.readFileSync(configPath, "utf8");
const config = JSON.parse(configJSON);

const ccpPath = path.join(__dirname, "..", "..", "..", "..", "network", "vars", "profiles", "default-channel_connection_for_nodesdk.json");
const ccpJSON = fs.readFileSync(ccpPath, "utf8");
const ccp = JSON.parse(ccpJSON);

router.post("/verify",
    verifyToken,
    async (req, res) => {
        console.log(req);
        const licenseKey = req.body.licenseid;
        const file = req.files.file;

        const walletPath = path.join(__dirname, "..", "..", "wallet");
        const wallet = await fabricNetwork.Wallets.newFileSystemWallet(walletPath);
        
        var identity = await wallet.get(req.username);
        
        if (identity) {
            const gateway = new fabricNetwork.Gateway();
            await gateway.connect(ccp, { wallet, identity: identity, discovery: config.gatewayDiscovery });
            const network = await gateway.getNetwork("default-channel");
            const contract = network.getContract("license");
            
            let transaction = contract.createTransaction("VerificationContract:VerifyOwnership");
            try {
                var hash = await ipfsClient.add(file.data, { onlyHash: true });
                let transactionResponse = await transaction.evaluate(licenseKey, hash.cid);
                res.send(transactionResponse);
                return;
            } catch (error) {
                console.log(error);
                res.send(error.payload);
                return;
            }
        }

        res.sendStatus(403);
    }
)

module.exports = router;