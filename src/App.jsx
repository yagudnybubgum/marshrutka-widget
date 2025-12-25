import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import PrivacyPolicy from './components/PrivacyPolicy'
import HomeScreen from './components/HomeScreen'
import FullSchedule533 from './components/FullSchedule533'
import FullSchedule429 from './components/FullSchedule429'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/homescreen" element={<HomeScreen />} />
      <Route path="/full533" element={<FullSchedule533 />} />
      <Route path="/full429" element={<FullSchedule429 />} />
    </Routes>
  )
}

export default App