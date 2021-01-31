const cors = require('cors');
const express = require('express');
const api = require('./routes/api');
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.port || 4000;

/**
 * /api/user/
 * /api/product/
 * /api/blockchain/
 */

app.use('/api', api);

app.get('/', (req, res) => {
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

app.listen(port, () => console.log(`Server started on port ${port}`));