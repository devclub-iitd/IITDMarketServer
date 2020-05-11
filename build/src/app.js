"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
app.set('port', process.env.PORT || 5000);
app.get('/', (req, res) => {
    res.send('Welcome to the IITD Market Server !!');
});
exports.default = app;
//# sourceMappingURL=app.js.map