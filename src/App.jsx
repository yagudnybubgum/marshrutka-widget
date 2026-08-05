import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import PrivacyPolicy from './components/PrivacyPolicy'
import HomeScreen from './components/HomeScreen'
import FullSchedulePage from './components/FullSchedulePage'
import RouteMapPage from './components/RouteMapPage'
import About from './components/About'
import DesignSystem from './components/DesignSystem'
import AnatomyPage from './components/AnatomyPage'

const LEGACY_FULL_ROUTES = ['533', '429', '664', '430A', '453', '605']

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="homescreen" element={<HomeScreen />} />
      </Route>
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/full/:routeId" element={<FullSchedulePage />} />
      <Route path="/map/:routeId" element={<RouteMapPage />} />
      {LEGACY_FULL_ROUTES.map((routeId) => (
        <Route
          key={routeId}
          path={`/full${routeId}`}
          element={<Navigate to={`/full/${routeId}`} replace />}
        />
      ))}
      <Route path="/about" element={<About />} />
      <Route path="/ds" element={<DesignSystem />} />
      <Route path="/anatomy" element={<AnatomyPage />} />
    </Routes>
  )
}

export default App
