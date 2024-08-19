import Network from './components/Network.component'
import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Seed from './components/Seed.component'
import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { onboarding } from './atoms'
import Dashboard from './components/Dashboard.component'

function App() {

  const setOnboard = useSetRecoilState(onboarding)
  const navigate = useNavigate()

  useEffect(() => {
    const LocalDB =  localStorage.getItem('seed')
    if(LocalDB) {
      setOnboard(false)
      navigate("/dashboard")
    }
    else{
      setOnboard(true)
      navigate("/onboarding/network")
    }
  },[])

  return (
      <div className='bg-zinc-950 p-4 text-white min-h-screen flex items-center justify-center'>
        <div className="container h-full flex justify-center ">
          <Routes>
            <Route path='/onboarding/network' element={<Network />} />
            <Route path='/onboarding/seed' element={<Seed />} />
            <Route path='/dashboard' element={<Dashboard />} />
          </Routes>
        </div>
      </div>
  )
}

export default App
