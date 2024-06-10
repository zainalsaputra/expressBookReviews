const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    // if (req.session.authorization) {
    //     token = req.session.authorization['accessToken'];
    //     jwt.verify(token, "access", (err, user) => {
    //         if (!err) {
    //             req.user = user;
    //             next();
    //         }
    //         else {
    //             return res.status(403).json({ message: "User not authenticated" })
    //         }
    //     });
    // } else {
    //     return res.status(403).json({ message: "User not logged in" })
    // }

    if (!req.session || !req.session.accessToken) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        // Verify the access token stored in the session
        const decoded = jwt.verify(req.session.accessToken, "its_mY-secReT-KeY");
        req.user = decoded;
        next();
    } catch (error) {
        // If the token is invalid, clear the session and send an error response
        req.session.destroy();
        return res.status(401).json({ error: "Unauthorized" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
