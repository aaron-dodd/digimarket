const express = require("express");
let router = express.Router();

router.get("/", (req, res) => {
    const result = {
        "links": [
            {
                "rel": "self",
                "href": "/api/product"
            },
            {
                "rel": "create",
                "href": "/api/product/create"
            },
            {
                "rel": "update",
                "href": "/api/product/update"
            },
            {
                "rel": "delete",
                "href": "/api/product/delete"
            },
        ]
    };

    res.json(result);
});

module.exports = router;