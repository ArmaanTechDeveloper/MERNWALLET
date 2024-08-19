import express from 'express';
import { 
    httpGenerateEtheriumKeypair, 
    httpGenerateMnemonicPhrase , 
    httpGenerateSolanaKeypair, 
    httpGetSeedPhrase,
    httpGetSolanaBalance,
    httpGetEthereumBalance
} from './controllers';

import path from 'path'
import 'dotenv/config'

const app = express();
const PORT = 3000;

app.use(express.json())

app.get('/api/generate/' , httpGenerateMnemonicPhrase)
app.post('/api/seed/' , httpGetSeedPhrase)
app.post('/api/solana/' , httpGenerateSolanaKeypair)
app.post('/api/etherium/' , httpGenerateEtheriumKeypair)
app.post('/api/getsolbalance', httpGetSolanaBalance)
app.post('/api/getethbalance' , httpGetEthereumBalance)

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
