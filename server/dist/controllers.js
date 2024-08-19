"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpGetEthereumBalance = exports.httpGetSolanaBalance = exports.httpGenerateEtheriumKeypair = exports.httpGenerateSolanaKeypair = exports.httpGetSeedPhrase = exports.httpGenerateMnemonicPhrase = void 0;
const bip39_1 = require("bip39");
const bs58_1 = __importDefault(require("bs58"));
const ed25519_hd_key_1 = require("ed25519-hd-key");
const web3_js_1 = require("@solana/web3.js");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const ethers_1 = require("ethers");
const axios_1 = __importDefault(require("axios"));
const httpGenerateMnemonicPhrase = (req, res) => {
    const mnemonic = (0, bip39_1.generateMnemonic)();
    return res.send({
        mnemonic: mnemonic
    });
};
exports.httpGenerateMnemonicPhrase = httpGenerateMnemonicPhrase;
const httpGetSeedPhrase = (req, res) => {
    const { mnemonic } = req.body;
    const seed = (0, bip39_1.mnemonicToSeedSync)(mnemonic);
    const seedPharaseBase58 = bs58_1.default.encode(seed);
    return res.send({
        seed: seedPharaseBase58
    });
};
exports.httpGetSeedPhrase = httpGetSeedPhrase;
const httpGenerateSolanaKeypair = (req, res) => {
    const { seed, index } = req.body;
    const seedPhrase = bs58_1.default.decode(seed);
    const buffer = Buffer.from(seedPhrase);
    const derivationPath = `m/44'/501'/${index}'/0'`;
    const derivedSeed = (0, ed25519_hd_key_1.derivePath)(derivationPath, buffer.toString('hex')).key;
    const secret = tweetnacl_1.default.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const publicKey = web3_js_1.Keypair.fromSecretKey(secret).publicKey.toBase58();
    //console.log("public key" , publicKey);
    //console.log("secret key" , bs58.encode(secret))
    return res.send({
        solPublicKey: publicKey,
        solSecret: bs58_1.default.encode(secret)
    });
};
exports.httpGenerateSolanaKeypair = httpGenerateSolanaKeypair;
const httpGenerateEtheriumKeypair = (req, res) => {
    const { seed, index } = req.body;
    const seedPhrase = Buffer.from(bs58_1.default.decode(seed));
    const derivationPath = `m/44'/60'/${index}'/0'`;
    const hdNode = ethers_1.HDNodeWallet.fromSeed(seedPhrase);
    const child = hdNode.derivePath(derivationPath);
    const ethWallet = new ethers_1.Wallet(child.privateKey);
    return res.send({ ethPublicKey: ethWallet.address, ethSecret: child.privateKey });
};
exports.httpGenerateEtheriumKeypair = httpGenerateEtheriumKeypair;
const httpGetSolanaBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { publickey } = req.body;
    const response = yield axios_1.default.post("https://solana-mainnet.g.alchemy.com/v2/42KkGIbztI2javG6kfsiiPC5547UMGlf", {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getBalance",
        "params": [`${publickey}`]
    });
    return res.send({
        balance: response.data.result.value / 1000000000
    }).status(200);
});
exports.httpGetSolanaBalance = httpGetSolanaBalance;
const httpGetEthereumBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { publickey } = req.body;
    const response = yield axios_1.default.post("https://eth-mainnet.g.alchemy.com/v2/42KkGIbztI2javG6kfsiiPC5547UMGlf", {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_getBalance",
        "params": [`${publickey}`, "latest"]
    });
    const balanceEth = (0, ethers_1.formatEther)(response.data.result);
    return res.send({
        balance: balanceEth
    });
});
exports.httpGetEthereumBalance = httpGetEthereumBalance;
