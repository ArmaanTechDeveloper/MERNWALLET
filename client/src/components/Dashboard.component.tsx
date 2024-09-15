import { ethWALLETS, solWALLETS } from "@/atoms"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { Button } from "./ui/button"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

import { wallet } from "@/atoms"
import axios from "axios"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
const Dashboard = () => {
    const [solWallets, setSolWallets] = useRecoilState(solWALLETS)
    const [ethWallets, setEthWallets] = useRecoilState(ethWALLETS)

    const [selectedWallet, setSelectedWallet] = useState<wallet>({
        publickey: '',
        secret: ''
    })
    const [selectedNetwork , setSelectedNetwork] = useState<string>("")
    const [balance , setBalance] = useState<number>(0)

    const [modalPublicKey , setModalPublicKey] = useState<string>("");
    const [modalAmount , setModalAmount] = useState<string>("0");

    const handleSendMoney = async () => {
        if(!Number(modalAmount)){
            console.log('Number not defined')
            return;
        }
        if(selectedNetwork === 'sol'){
            await axios.post('/api/sendsol' , {
                toPublicKey: modalPublicKey,
                fromPublicKey: selectedWallet.publickey,
                fromPrivateKey: selectedWallet.secret,
                sol: modalAmount
            })
        }
        setModalPublicKey("");
        setModalAmount("0")
    }
    const getWallets = () => {
        const localSolWallets = localStorage.getItem("solanaWallets")
        const localEthWallets = localStorage.getItem("ethereumWallets")

        if (localSolWallets) {
            const parsed = JSON.parse(localSolWallets)
            setSolWallets(parsed)
            setSelectedWallet(parsed[0])
            setSelectedNetwork("sol")
        }
        if (localEthWallets) {
            const parsed = JSON.parse(localEthWallets)
            setEthWallets(parsed)
            setSelectedWallet(parsed[0])
            setSelectedNetwork("eth")
        }

    }

    const getSolanaWallet = async () => {
        const localSeed = localStorage.getItem('seed')
        if(!localSeed) return
        
        let seed = JSON.parse(localSeed)

        const parsedSeed =  await axios.post('/api/seed' , {
            mnemonic: seed.mnemonic
        })

        seed = parsedSeed.data.seed
        const index = solWallets.length

        const wallet = await axios.post('/api/solana' , {
            seed: seed,
            index
        })
        const newWallets = [...solWallets , { publickey: wallet.data.solPublicKey , secret: wallet.data.solSecret }]
        setSolWallets(newWallets)
        localStorage.setItem('solanaWallets' , JSON.stringify(newWallets))
    }

    const getEthereumWallet = async () => {
        const localSeed = localStorage.getItem('seed')
        if(!localSeed) return
        
        let seed = JSON.parse(localSeed)

        const parsedSeed =  await axios.post('/api/seed' , {
            mnemonic: seed.mnemonic
        })

        seed = parsedSeed.data.seed
        const index = ethWallets.length

        const wallet = await axios.post('/api/etherium' , {
            seed: seed,
            index
        })
        const newWallets = [...ethWallets , { publickey: wallet.data.ethPublicKey , secret: wallet.data.ethSecret }]
        setEthWallets(newWallets)
        localStorage.setItem('ethereumWallets' , JSON.stringify(newWallets))
    }

    const getBalance = async () => {
        if(selectedNetwork === 'sol'){
            const response = await axios.post('/api/getsolbalance/', {
                publickey: selectedWallet.publickey
            })
            setBalance(response.data.balance)
        }
        else if(selectedNetwork === 'eth'){
            const response = await axios.post('/api/getethbalance/' , {
                publickey: selectedWallet.publickey
            })

            setBalance(response.data.balance)
        }
    }
    useEffect(() => {
        getWallets()
    }, [])

    useEffect(() => {
        getBalance()
    }, [selectedWallet])
    return (
        <div className="border-2 p-8 w-3/4">
            <div className="my-10">
            <div className="solanawallets">
                <h1 className="text-4xl my-3">Your Solana Wallets</h1>
                {solWallets.map((wallet, index) => (
                    <Button className="mx-1" variant={wallet.publickey === selectedWallet.publickey? "destructive" : "secondary"} onClick={() => {
                        setSelectedWallet(wallet)
                        setSelectedNetwork("sol")
                    }}>{`wallet ${index + 1}`}</Button>
                ))}
                <Button onClick={() => getSolanaWallet()}>+Add more</Button>
            </div>

            <div className="ethereumwallets">
                <h1 className="text-4xl my-3">Your Ethereum Wallets</h1>
                {ethWallets.map((wallet, index) => (
                    <Button className="mx-1" variant={wallet.publickey === selectedWallet.publickey? "destructive" : "secondary"} onClick={() => {
                        setSelectedWallet(wallet)
                        setSelectedNetwork("eth")
                    }}>{`wallet ${index + 1}`}</Button>
                ))}
                <Button onClick={() => getEthereumWallet()}>+Add more</Button>
            </div>
            </div>
            <div className="balance flex justify-between">
                <div className="flex">
                    <h1 className="text-6xl">{`${balance}`}</h1>
                    <h3>{selectedNetwork==='sol'? 'sol' : 'eth'}</h3>
                </div>
                <Dialog>
                    <DialogTrigger><Button variant='secondary'>Send</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-3xl">Send {selectedNetwork==='sol'? 'Solana' : 'Ethereum'}</DialogTitle>
                        </DialogHeader>
                        <div>
                            <Label className="text-xl">To public key</Label>
                            <Input type="text" className="my-3" value={modalPublicKey} onChange={(e) => setModalPublicKey(e.target.value)}></Input>
                        </div>
                        <div>
                            <Label className="text-xl">{selectedNetwork==='sol'? 'Solana' : 'Ethereum'}</Label>
                            <Input className="my-3" value={modalAmount} onChange={(e) => setModalAmount(e.target.value)}></Input>
                        </div>

                        <Button onClick={handleSendMoney}>Send</Button>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="keys my-10">
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xl">Show public key</AccordionTrigger>
                        <AccordionContent>
                            {selectedWallet.publickey}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-xl">Show private key</AccordionTrigger>
                        <AccordionContent>
                            {selectedWallet.secret}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

        </div>
    )
}

export default Dashboard