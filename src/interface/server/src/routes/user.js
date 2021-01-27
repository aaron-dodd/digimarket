const express = require('express');
const path = require('path');
let router = express.Router();

var fabricCAClient = require('fabric-ca-client');
var fabricCommon = require('fabric-common');
var fabricNetwork = require('fabric-network');

router.use(express.urlencoded());

router.get('/', (req, res) => {
    var fcs = new fabricCAClient('http://localhost:7054', );

    const result = {
        "links": [
            {
                "rel": "self",
                "href": "/api/user"
            },
            {
                "rel": "create",
                "href": "/api/user/create"
            },
            {
                "rel": "update",
                "href": "/api/user/update"
            },
            {
                "rel": "delete",
                "href": "/api/user/delete"
            },
            {
                "rel": "login",
                "href": "/api/user/login"
            },
            {
                "rel": "logout",
                "href": "/api/user/logout"
            }
        ]
    };

    res.json(result);
});

router.post('/login', (req, res) => {
    console.log(req.body);
});

router.post('/create', (req, res) => {
    console.log(req.body);

    var ccpPath = path.resolve(
        __dirname,
        'profiles', 'mychannel_connection_for_nodesdk.json'
        )
    
    console.log(ccpPath);
    res.send('sample');
});

module.exports = router;