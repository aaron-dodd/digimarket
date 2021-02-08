const express = require("express");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

var fabricCAClient = require("fabric-ca-client");
var fabricCommon = require("fabric-common");
var fabricNetwork = require("fabric-network");

var verifyToken = require("../middleware/auth/verify-token");

const configPath = path.join(__dirname, "..", "..", "config", "config.json");
const configJSON = fs.readFileSync(configPath, "utf8");
const config = JSON.parse(configJSON);

const ccpPath = path.join(__dirname, "..", "..", "..", "..", "network", "vars", "profiles", "default-channel_connection_for_nodesdk.json");
const ccpJSON = fs.readFileSync(ccpPath, "utf8");
const ccp = JSON.parse(ccpJSON);

let router = express.Router();

router.get("/query/all",
    verifyToken,
    async (req, res) => {
        const walletPath = path.join(__dirname, "..", "..", "wallet");
        const wallet = await fabricNetwork.Wallets.newFileSystemWallet(walletPath);

        var userIdentity = await wallet.get(req.username);

        if (userIdentity) {
            const gateway = new fabricNetwork.Gateway();
            await gateway.connect(ccp, { wallet, identity: userIdentity, discovery: config.gatewayDiscovery });
            const network = await gateway.getNetwork("default-channel");
            const contract = network.getContract("license");
    
            let transaction = contract.createTransaction("ProductContract:GetAllProducts");
            let transactionResponse = await transaction.evaluate("");
            res.send(transactionResponse);
            return;
        }

        res.sendStatus(403);
    }
);

router.get("/query/user",
    verifyToken,
    async (req, res) => {
        const walletPath = path.join(__dirname, "..", "..", "wallet");
        const wallet = await fabricNetwork.Wallets.newFileSystemWallet(walletPath);

        var userIdentity = await wallet.get(req.username);

        if (userIdentity) {
            const gateway = new fabricNetwork.Gateway();
            await gateway.connect(ccp, { wallet, identity: userIdentity, discovery: config.gatewayDiscovery });
            const network = await gateway.getNetwork("default-channel");
            const contract = network.getContract("license");
    
            let transaction = contract.createTransaction("ProductContract:GetProductsForOwner");
            let transactionResponse = await transaction.evaluate(req.username);
            res.send(transactionResponse);
            return;
        }

        res.sendStatus(403);
    }
);

router.post("/license/add",
    verifyToken,
    async (req, res) => {
        const walletPath = path.join(__dirname, "..", "..", "wallet");
        const wallet = await fabricNetwork.Wallets.newFileSystemWallet(walletPath);

        var userIdentity = await wallet.get(req.username);

        if (userIdentity) {
            const gateway = new fabricNetwork.Gateway();
            await gateway.connect(ccp, { wallet, identity: userIdentity, discovery: config.gatewayDiscovery });
            const network = await gateway.getNetwork("default-channel");
            const contract = network.getContract("license");

            let addLicenseTransaction = contract.createTransaction("LicenseContract:PutLicense");

            // id string, owner string, creationTime time.Time, contentID string, versionNumber int, expiration time.Time
            let expirationDate = new Date();
            expirationDate.setFullYear(expirationDate.getFullYear() + 1);
            console.log(expirationDate);

            let addLicenseTransactionResponse = await addLicenseTransaction.submit(
                uuidv4(),
                req.username,
                new Date().toISOString(),
                req.body.productid,
                req.body.productversion,
                expirationDate.toISOString(),
            );
            res.send(addLicenseTransactionResponse);
            return;
        }

        res.sendStatus(403);
    }
)

router.post("/create",
    verifyToken,
    async (req, res) => {
    }
);

module.exports = router;