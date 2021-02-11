const express = require("express");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const ipfsCreateClient = require("ipfs-http-client");

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

const ipfsClient = ipfsCreateClient("http://localhost:5001/");

router.post("/upload",
    verifyToken,
    async (req, res) => {
        console.log(req.files);
        let file = req.files.file;
        console.log(file);
        
        // Track product on ledger
        const walletPath = path.join(__dirname, "..", "..", "wallet");
        const wallet = await fabricNetwork.Wallets.newFileSystemWallet(walletPath);

        var userIdentity = await wallet.get(req.username);

        if (userIdentity) {
            // Add file to IPFS
            let fileHash = "";
            await ipfsClient.add(file.data).then((res) => {
                console.log(res);
                fileHash = res.cid;
            });
            console.log(fileHash);

            if (fileHash !== "") {
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
                    fileHash,
                    "1" // TODO: do something cool with version number
                );
                console.log(transactionResponse);
                res.send(transactionResponse);
            }
        } else {
            res.sendStatus(403);
        }
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
            const filehash = transactionObject.filehash;
            console.log(filehash);
            const filePath = path.resolve(__dirname, "..", "..", "files", filename);

            let data = [];

            const files = ipfsClient.get(filehash);
            for await (const file of files) {
                if (file.type === "file") {
                    for await (const chunk of file.content) {
                        res.write(chunk);
                    }
                }
            }

            console.log("end");
            
            console.log(filePath);
            console.log(data);
            res.end();
        } else {
            res.sendStatus(404);
        }
    }
);

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

router.get("/query/licensed",
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
    
            let transaction = contract.createTransaction("ProductContract:GetLicensedProducts");
            let transactionResponse = await transaction.evaluate(req.username);
            console.log(transactionResponse);
            res.send(transactionResponse);
        } else {
            res.sendStatus(403);
        }
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