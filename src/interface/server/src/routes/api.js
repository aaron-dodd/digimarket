const express = require("express");
const ipfs = require("./ipfs");
const license = require("./license");
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

router.use("/license", license);
router.use("/ipfs", ipfs);
router.use("/product", product);
router.use("/user", user);

module.exports = router;