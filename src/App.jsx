import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import PrivacyPolicy from './components/PrivacyPolicy'
import HomeScreen from './components/HomeScreen'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/homescreen" element={<HomeScreen />} />
    </Routes>
  )
}

export default App