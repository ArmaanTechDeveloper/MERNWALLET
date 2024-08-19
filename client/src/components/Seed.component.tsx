import axios from "axios"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { useRecoilValue } from "recoil"
import { network } from "@/atoms"

interface seed {
    mnemonic: string
}

const Seed = () => {
    // generate a seed phrase and set it in the browser local storage
    const [seed, setSeed] = useState<seed>({
        mnemonic: ''
    })
    const selNetwork = useRecoilValue(network)

    const navigate = useNavigate()

    // ... change the name of the function
    const getSeedAndCreateWallet = async () => {
        const response = await axios.get('/api/generate')
        setSeed(response.data)
        localStorage.setItem('seed' , JSON.stringify(response.data))
        const parsedSeed =  await axios.post('/api/seed' , {
            mnemonic: response.data.mnemonic
        })

        if(selNetwork === 'solana'){
            const wallet = await axios.post('/api/solana' , {
                seed: parsedSeed.data.seed,
                index: 0
            })
            const wallets = [
                {
                    publickey: wallet.data.solPublicKey,
                    secret: wallet.data.solSecret
                }
            ]
            localStorage.setItem('solanaWallets', JSON.stringify(wallets));
        }
        else if (selNetwork === 'ethereum'){
            const wallet = await axios.post('/api/etherium' , {
                seed: parsedSeed.data.seed,
                index: 0
            })
            const wallets = [
                {
                    publickey: wallet.data.ethPublicKey,
                    secret: wallet.data.ethSecret
                }
            ]
            localStorage.setItem('ethereumWallets', JSON.stringify(wallets));

        }
    }

    useEffect(() => {
        getSeedAndCreateWallet()
    }, [])
    return (
        <div className="flex flex-col">
            <div className="mnemonic grid grid-cols-4 gap-4">
                {seed.mnemonic.split(" ").map((word, index) => (
                    <div key={index} className="border-2 px-6 py-4 inline text-2xl">
                        {word}
                    </div>
                ))}
            </div>
            <Toaster />
            <div className="accept mt-4 flex items-center justify-between">
                <Button onClick={() => {
                    navigator.clipboard.writeText(seed.mnemonic)
                    toast("Copied to clipboard")
                }}>Copy</Button>
                <Button variant="secondary" className="w-2/12" onClick={() => navigate("/dashboard")}>Proceed</Button>
            </div>
        </div>
    )
}

export default Seed