const crypto = require("crypto");
const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const path = require("path");

const verifyToken = require("../middleware/auth/verify-token");

var fabricCAClient = require("fabric-ca-client");
var fabricCommon = require("fabric-common");
var fabricNetwork = require("fabric-network");

require("../middleware/auth/authentication");
const UserModel = require("../model/user");

const configPath = path.join(__dirname, "..", "..", "config", "config.json");
const configJSON = fs.readFileSync(configPath, "utf8");
const config = JSON.parse(configJSON);

const ccpPath = path.join(__dirname, "..", "..", "..", "..", "network", "vars", "profiles", "default-channel_connection_for_nodesdk.json");
const ccpJSON = fs.readFileSync(ccpPath, "utf8");
const ccp = JSON.parse(ccpJSON);

let router = express.Router();

router.post(
    "/login",
    async (req, res, next) => {
        if (req.files !== undefined && req.files !== null) {
            let file = req.files.walletFile;
            // Get uploaded file hash
            let uploadedFileHasher = crypto.createHash("sha1");
            const uploadedFileHash = uploadedFileHasher.update(file.data).digest("base64");
            console.log(uploadedFileHash)
            let walletFileHash;
            let username = "";

            // Search through wallet files looking for the correct one
            const walletPath = path.join(__dirname, "..", "..", "wallet");
            fs.readdirSync(walletPath).forEach(f => {
                const absPath = path.join(walletPath, f);
                const data = fs.readFileSync(absPath);
                let walletHasher = crypto.createHash("sha1");
                walletFileHash = walletHasher.update(data).digest("base64");
                if (uploadedFileHash == walletFileHash) {
                    console.log("hashes match: " + walletFileHash);

                    // get username from uploaded wallet
                    username = f.substr(0, f.lastIndexOf("."));
                    console.log(username);
                }
            });

            console.log(username);

            if (username.length > 0) {
                const user = await UserModel.findOne({ username });
                const body = { _id: user._id, username: user.username };
                const token = jwt.sign({ user: body }, "SECRET_JWT_SIGN_TOKEN");

                return res.json({
                    authenticated: true,
                    token: token,
                });
            }
        } else {
            passport.authenticate(
                "loginStrategy",
                async (err, user, info) => {
                    try {
                        if (err || !user) {
                            return res.json({
                                authenticated: false,
                                message: info.message,
                            });
                        }

                        req.login(
                            user,
                            { session: false },
                            async (error) => {
                                if (error) return next(error);

                                const body = { _id: user._id, username: user.username };
                                const token = jwt.sign({ user: body }, "SECRET_JWT_SIGN_TOKEN");

                                return res.json({
                                    authenticated: true,
                                    token: token,
                                });
                            }
                        );
                    } catch (error) {
                        return next(error);
                    }
                }
            )(req, res, next);
        }
    }
);

router.post("/signup",
    passport.authenticate("signupStrategy", { session: false }),
    async (req, res) => {
        var userName = req.body.username;
        var userSecret = req.body.password;
        var userMSPID = req.body.mspid;

        const caURL = ccp.certificateAuthorities["ca1.org1.digimarket.com"].url;
        console.log(caURL);
        var fcs = new fabricCAClient(caURL);

        const walletPath = path.join(__dirname, "..", "..", "wallet");
        const wallet = await fabricNetwork.Wallets.newFileSystemWallet(walletPath);

        // Check for admin identity
        {
            const adminExists = await wallet.get(config.adminUsername);
            if (adminExists) {
                console.log("An identity for the admin user \"admin\" already exists in the wallet");
            } else {
                console.log(`An identity does not exist in the wallet for the admin user ${config.adminUsername}. creating`);

                let adminEnrollment = await fcs.enroll({
                    enrollmentID: config.adminUsername,
                    enrollmentSecret: config.adminSecret,
                });

                let identity = {
                    credentials: {
                        certificate: adminEnrollment.certificate,
                        privateKey: adminEnrollment.key.toBytes(),
                    },
                    mspId: config.orgMSPID,
                    type: "X.509",
                };

                await wallet.put(config.adminUsername, identity);
            }
        }

        // Check for user identity
        const userExists = await wallet.get(userName);
        if (userExists) {
            console.log("User exists. Aborting");
            res.json({ "result": "user exists" });
            return;
        } else {
            console.log("User does not exist. Creating");
        }

        const adminIdentity = await wallet.get(config.adminUsername);
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, config.adminUsername);

        await fcs.register({
            affiliation: config.defaultAffiliation,
            enrollmentID: userName,
            enrollmentSecret: userSecret,
            role: "client"
        }, adminUser);

        const userEnrollment = await fcs.enroll({ enrollmentID: userName, enrollmentSecret: userSecret });

        const userIdentity = {
            credentials: {
                certificate: userEnrollment.certificate,
                privateKey: userEnrollment.key.toBytes(),
            },
            mspId: userMSPID,
            type: "X.509",
        };

        // Create wallet
        wallet.put(userName, userIdentity);

        res.json();
    }
);

router.post("/wallet/download",
    verifyToken,
    async (req, res) => {
        const walletPath = path.join(__dirname, "..", "..", "wallet");
        const wallet = await fabricNetwork.Wallets.newFileSystemWallet(walletPath);

        var userIdentity = await wallet.get(req.username);

        if (userIdentity) {
            res.sendFile(path.join(walletPath, req.username + ".id"), (err) => {
                if (err) {
                    res.sendStatus(err.status).end()
                }
            });
        }
    }
)

module.exports = router;