import { useNavigate } from 'react-router-dom'
import FullSchedule from './FullSchedule'

const FullSchedule430A = () => {
  const navigate = useNavigate()
  
  return (
    <FullSchedule 
      routeNumber="430A" 
      onBack={() => navigate('/')} 
    />
  )
}

export default FullSchedule430A
