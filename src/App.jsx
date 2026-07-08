import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import PrivacyPolicy from './components/PrivacyPolicy'
import HomeScreen from './components/HomeScreen'
import FullSchedulePage from './components/FullSchedulePage'
import About from './components/About'

const LEGACY_FULL_ROUTES = ['533', '429', '664', '430A', '453']

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/homescreen" element={<HomeScreen />} />
      <Route path="/full/:routeId" element={<FullSchedulePage />} />
      {LEGACY_FULL_ROUTES.map((routeId) => (
        <Route
          key={routeId}
          path={`/full${routeId}`}
          element={<Navigate to={`/full/${routeId}`} replace />}
        />
      ))}
      <Route path="/about" element={<About />} />
    </Routes>
  )
}

export default App
