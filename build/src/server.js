"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const server = app_1.default.listen(app_1.default.get('port'), () => {
    console.log(`App is Running at http://localhost:${app_1.default.get('port')}`);
    console.log('  Press CTRL-C to stop\n');
});
exports.default = server;
//# sourceMappingURL=server.js.map