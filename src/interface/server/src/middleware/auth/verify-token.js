const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const accessTokenHeader = req.headers["x-access-token"];

    if (typeof(accessTokenHeader) !== "undefined") {
        const token = accessTokenHeader.split(' ')[1];
        jwt.verify(token, 'SECRET_JWT_SIGN_TOKEN', (err, authData) => {
            if (err) {
                res.sendStatus(403);
                return;
            }
            req.username = authData.user.username;
        })
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports = verifyToken;