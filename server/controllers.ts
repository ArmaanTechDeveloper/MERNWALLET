import { Request , Response } from "express"
import { generateMnemonic, mnemonicToSeedSync } from "bip39"
import bs58 from "bs58"
import { derivePath } from "ed25519-hd-key"
import { Keypair } from "@solana/web3.js"
import nacl from "tweetnacl"
import { ethers, HDNodeWallet, Wallet, parseEther, formatEther } from "ethers"
import axios from "axios"

const httpGenerateMnemonicPhrase = (req:Request , res:Response) => {
    const mnemonic = generateMnemonic()
    return res.send({
        mnemonic: mnemonic
    })
}

const httpGetSeedPhrase = (req: Request , res:Response) => {
    const { mnemonic } = req.body
    const seed = mnemonicToSeedSync(mnemonic)
    const seedPharaseBase58 = bs58.encode(seed)
    return res.send({
        seed: seedPharaseBase58
    })
}

const httpGenerateSolanaKeypair = (req: Request , res: Response) => {
    const { seed , index } = req.body;
    const seedPhrase = bs58.decode(seed);
    const buffer = Buffer.from(seedPhrase)

    const derivationPath = `m/44'/501'/${index}'/0'`
    const derivedSeed = derivePath(derivationPath , buffer.toString('hex')).key

    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
    const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();

    //console.log("public key" , publicKey);
    //console.log("secret key" , bs58.encode(secret))

    return res.send({ 
        solPublicKey: publicKey,
        solSecret: bs58.encode(secret)
    })
}

const httpGenerateEtheriumKeypair = (req: Request , res:Response) => {
    const { seed , index } = req.body;
    const seedPhrase = Buffer.from(bs58.decode(seed))

    const derivationPath = `m/44'/60'/${index}'/0'`

    const hdNode =  HDNodeWallet.fromSeed(seedPhrase)
    const child = hdNode.derivePath(derivationPath)

    const ethWallet = new Wallet(child.privateKey)
    return res.send({ ethPublicKey: ethWallet.address ,  ethSecret: child.privateKey})

}

const httpGetSolanaBalance = async (req: Request , res: Response) => {
    const {publickey} = req.body
    const response = await axios.post("https://solana-mainnet.g.alchemy.com/v2/42KkGIbztI2javG6kfsiiPC5547UMGlf" , {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getBalance",
        "params": [`${publickey}`]
    })

    return res.send({
        balance: response.data.result.value/1_000_000_000
    }).status(200)
}

const httpGetEthereumBalance = async (req: Request , res:Response) => {
    const { publickey } = req.body

    const response = await axios.post("https://eth-mainnet.g.alchemy.com/v2/42KkGIbztI2javG6kfsiiPC5547UMGlf" , {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_getBalance",
        "params": [`${publickey}`, "latest"]
    })
    
    const balanceEth = formatEther(response.data.result)
    return res.send({
        balance: balanceEth
    })
}

export {
    httpGenerateMnemonicPhrase,
    httpGetSeedPhrase,
    httpGenerateSolanaKeypair,
    httpGenerateEtheriumKeypair,
    httpGetSolanaBalance,
    httpGetEthereumBalance
}