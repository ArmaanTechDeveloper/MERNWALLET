"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.solanaDevnetConnection = exports.solanaDevnet = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("./controllers");
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const web3_js_1 = require("@solana/web3.js");
const app = (0, express_1.default)();
const PORT = 3000;
exports.solanaDevnet = "https://solana-devnet.g.alchemy.com/v2/42KkGIbztI2javG6kfsiiPC5547UMGlf";
exports.solanaDevnetConnection = new web3_js_1.Connection(exports.solanaDevnet, 'confirmed');
app.use(express_1.default.json());
app.get('/api/generate/', controllers_1.httpGenerateMnemonicPhrase);
app.post('/api/seed/', controllers_1.httpGetSeedPhrase);
app.post('/api/solana/', controllers_1.httpGenerateSolanaKeypair);
app.post('/api/etherium/', controllers_1.httpGenerateEtheriumKeypair);
app.post('/api/getsolbalance', controllers_1.httpGetSolanaBalance);
app.post('/api/getethbalance', controllers_1.httpGetEthereumBalance);
app.post('/api/sendsol', controllers_1.httpSendSolana);
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
    app.use('/*', (req, res) => {
        return res.sendFile(path_1.default.join(__dirname, '..', 'public', 'index.html'));
    });
}
app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`);
});
