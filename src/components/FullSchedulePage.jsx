import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { isValidRouteId } from '../config/routes'
import FullSchedule from './FullSchedule'

const FullSchedulePage = () => {
  const { routeId } = useParams()
  const navigate = useNavigate()

  if (!isValidRouteId(routeId)) {
    return <Navigate to="/" replace />
  }

  return <FullSchedule routeNumber={routeId} onBack={() => navigate('/')} />
}

export default FullSchedulePage
