import { useNavigate } from 'react-router-dom'
import FullSchedule from './FullSchedule'

const FullSchedule453 = () => {
  const navigate = useNavigate()
  
  return (
    <FullSchedule 
      routeNumber="453" 
      onBack={() => navigate('/')} 
    />
  )
}

export default FullSchedule453
