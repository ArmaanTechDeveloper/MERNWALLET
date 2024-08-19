import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { useSetRecoilState } from "recoil";
import { network } from "@/atoms";

const Network = () => {
    const navigate = useNavigate();
    const setNetwork = useSetRecoilState(network)

    function naigateToSeedPhrase() {
        navigate("/onboarding/seed")
    }
    return (
        <div>
            <h1 className="text-6xl">Select a network 🚀</h1>
            <div>
                <Button className="w-full my-4 text-xl p-6" onClick={() => {
                    naigateToSeedPhrase()
                    setNetwork("solana")
                }}>Solana</Button>
                <Button className="w-full mb-4 text-xl p-6" onClick={() => {
                    naigateToSeedPhrase()
                    setNetwork("ethereum")
                }}>Ethereum</Button>
            </div>    
        </div>
    )
}

export default Network