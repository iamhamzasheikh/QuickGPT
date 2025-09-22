import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Message from './components/Message'
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import { Routes, Route } from 'react-router-dom'
import { assets } from './assets/assets'

const App = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>

      {!isMenuOpen && <img src={assets.menu_icon} className='absolute top-3 left-3 w-8 h-8 md:hidden not-dark:invert'
        onClick={() => setIsMenuOpen(true)} />}

      <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>

        <div className='flex h-screen w-screen'>
          <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

          <Routes>
            <Route path='/' element={<ChatBox />} />
            <Route path='/credits' element={<Credits />} />
            <Route path='/community' element={<Community />} />
          </Routes>

        </div>


      </div>

    </>
  )
}

export default App
