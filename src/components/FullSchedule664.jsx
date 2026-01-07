import { useNavigate } from 'react-router-dom'
import FullSchedule from './FullSchedule'

const FullSchedule664 = () => {
  const navigate = useNavigate()
  
  return (
    <FullSchedule 
      routeNumber="664" 
      onBack={() => navigate('/')} 
    />
  )
}

export default FullSchedule664

