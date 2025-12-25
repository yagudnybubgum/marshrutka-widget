import { useNavigate } from 'react-router-dom'
import FullSchedule from './FullSchedule'

const FullSchedule533 = () => {
  const navigate = useNavigate()
  
  return (
    <FullSchedule 
      routeNumber="533" 
      onBack={() => navigate('/')} 
    />
  )
}

export default FullSchedule533
