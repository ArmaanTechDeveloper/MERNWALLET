import express from 'express';
import { 
    httpGenerateEtheriumKeypair, 
    httpGenerateMnemonicPhrase , 
    httpGenerateSolanaKeypair, 
    httpGetSeedPhrase,
    httpGetSolanaBalance,
    httpGetEthereumBalance,
    httpSendSolana
} from './controllers';

import path from 'path'
import 'dotenv/config'
import { Connection } from '@solana/web3.js';

const app = express();
const PORT = 3000;
export const solanaDevnet = "https://solana-devnet.g.alchemy.com/v2/42KkGIbztI2javG6kfsiiPC5547UMGlf"
export const solanaDevnetConnection = new Connection(solanaDevnet , 'confirmed')

app.use(express.json())

app.get('/api/generate/' , httpGenerateMnemonicPhrase)
app.post('/api/seed/' , httpGetSeedPhrase)
app.post('/api/solana/' , httpGenerateSolanaKeypair)
app.post('/api/etherium/' , httpGenerateEtheriumKeypair)
app.post('/api/getsolbalance', httpGetSolanaBalance)
app.post('/api/getethbalance' , httpGetEthereumBalance)
app.post('/api/sendsol' , httpSendSolana)

console.log(process.env.NODE_ENV)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname  , 'public')))
    app.use('/*' , (req , res) => {
        return res.sendFile(path.join(__dirname , 'public' , 'index.html'))
    })
}

app.listen(PORT , () => {
    console.log(`Listening on port http://localhost:${PORT}`)
})
