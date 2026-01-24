import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import PrivacyPolicy from './components/PrivacyPolicy'
import HomeScreen from './components/HomeScreen'
import FullSchedule533 from './components/FullSchedule533'
import FullSchedule429 from './components/FullSchedule429'
import FullSchedule664 from './components/FullSchedule664'
import FullSchedule430A from './components/FullSchedule430A'
import FullSchedule453 from './components/FullSchedule453'
import About from './components/About'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/homescreen" element={<HomeScreen />} />
      <Route path="/full533" element={<FullSchedule533 />} />
      <Route path="/full429" element={<FullSchedule429 />} />
      <Route path="/full664" element={<FullSchedule664 />} />
      <Route path="/full430A" element={<FullSchedule430A />} />
      <Route path="/full453" element={<FullSchedule453 />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}

export default App