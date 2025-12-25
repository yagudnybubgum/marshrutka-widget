import { useNavigate } from 'react-router-dom'
import FullSchedule from './FullSchedule'

const FullSchedule429 = () => {
  const navigate = useNavigate()
  
  return (
    <FullSchedule 
      routeNumber="429" 
      onBack={() => navigate('/')} 
    />
  )
}

export default FullSchedule429
