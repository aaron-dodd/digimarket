const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const upload = require("express-fileupload");

const api = require("./routes/api");
const app = express();

app.use(cors());
app.use(bodyParser.json({
    extended: true
}));
app.use(upload());

const port = process.env.port || 4000;

/**
 * /api/user/
 * /api/product/
 * /api/blockchain/
 */

app.use("/api", api);

app.get("/", (req, res) => {
    const result = {
        "links": [
            {
                "rel": "self",
                "href": "/"
            },
            {
                "rel": "api",
                "href": "/api"
            }
        ]
    };

    res.json(result);
});

mongoose.connect(
    "mongodb://127.0.0.1:27017/digimarket",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => {
    app.listen(port, () => console.log(`Server started on port ${port}`));
});
