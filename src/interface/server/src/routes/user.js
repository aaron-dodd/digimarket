const express = require('express');
const fs = require('fs');
const path = require('path');

var fabricCAClient = require('fabric-ca-client');
var fabricCommon = require('fabric-common');
var fabricNetwork = require('fabric-network');

const configPath = path.join(__dirname, "../../config/config.json");
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);

const ccpPath = path.join(__dirname, '../../config/connection-profile.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

let router = express.Router();
router.use(express.urlencoded());

router.get('/', async (req, res) => {
    var fcs = new fabricCAClient('http://localhost:7054');

    const walletPath = path.join(__dirname, '../../wallet');
    const wallet = await fabricNetwork.Wallets.newFileSystemWallet(walletPath);

    // Check for admin identity
    {
        const adminExists = await wallet.get(config.adminUsername);
        if (adminExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
        } else {
            console.log(`An identity does not exist in the wallet for the admin user ${config.adminUsername}. creating`);

            const adminEnrollment = await fcs.enroll({
                enrollmentID: config.adminUsername,
                enrollmentSecret: config.adminSecret,
            });

            const identity = {
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

    const userName = 'test01';
    const userSecret = 'test01pw';

    const gateway = new fabricNetwork.Gateway();
    await gateway.connect(ccp, { wallet, identity: config.adminUsername, discovery: config.gatewayDiscovery });

    const adminIdentity = await wallet.get(config.adminUsername);
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, config.adminUsername);

    await fcs.register({
        affiliation: config.defaultAffiliation,
        enrollmentID: userName,
        enrollmentSecret: userSecret,
        role: 'client'
    }, adminUser);

    const userEnrollment = await fcs.enroll({ enrollmentID: userName, enrollmentSecret: userSecret });

    const userIdentity = {
        credentials: {
            certificate: userEnrollment.certificate,
            privateKey: userEnrollment.key.toBytes(),
        },
        mspId: config.orgMSPID,
        type: "X.509",
    };

    wallet.put(userName, userIdentity);

    res.json({ "foo": "bar" });
});

router.post('/login', (req, res) => {
    console.log(req.body);
});

router.post('/create', async (req, res) => {
    var fcs = new fabricCAClient('http://localhost:7054');

    const walletPath = path.join(__dirname, '../../wallet');
    const wallet = await fabricNetwork.Wallets.newFileSystemWallet(walletPath);

    // Check for admin identity
    {
        const adminExists = await wallet.get(config.adminUsername);
        if (adminExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
        } else {
            console.log(`An identity does not exist in the wallet for the admin user ${config.adminUsername}. creating`);

            const adminEnrollment = await fcs.enroll({
                enrollmentID: config.adminUsername,
                enrollmentSecret: config.adminSecret,
            });

            const identity = {
                credentials: {
                    certificate: adminEnrollment.certificate,
                    privateKey: adminEnrollment.key.toBytes(),
                },
                mspId: config.orgMSPID,
                type: 'X.509',
            };

            await wallet.put(config.adminUsername, identity);
        }
    }

    // Check for user identity
    const username = "foobar";
    const userSecret = "foobar";
    const userExists = await wallet.get(username);
    if (userExists) {
        console.log9("User exists. Aborting");
        res.json({ "result": "user exists" });
        return;
    } else {
        console.log("User does not exist. Creating");
    }

    res.json({ "foo": "bar" });
});

module.exports = router;