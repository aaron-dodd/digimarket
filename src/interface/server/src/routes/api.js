const express = require("express");
const blockchain = require("./blockchain");
const ipfs = require("./ipfs");
const product = require("./product");
const user = require("./user");

let router = express.Router();

router.get("/", (req, res) => {
    const result = {
        "links": [
            {
                "rel": "self",
                "href": "/api"
            },
            {
                "rel": "user",
                "href": "/api/user",
            },
            {
                "rel": "product",
                "href": "/api/product",
            },
            {
                "rel": "blockchain",
                "href": "/api/blockchain",
            }
        ]
    };

    res.json(result);
});

router.use("/blockchain", blockchain);
router.use("/ipfs", ipfs);
router.use("/product", product);
router.use("/user", user);

module.exports = router;