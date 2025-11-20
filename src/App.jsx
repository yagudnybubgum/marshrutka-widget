import { useState } from 'react'
import MarshrutkaWidget from './components/MarshrutkaWidget'

function App() {
  const [schedule, setSchedule] = useState(null)

  return (
    <div className="min-h-screen bg-base-200 py-6 px-3 sm:py-10">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-normal text-black">
            Маршрутка 533
          </h1>
          {schedule && (
            <div className="badge badge-lg font-normal bg-gray-100 text-black rounded-full">
              {schedule.isWeekend ? 'Выходной день' : 'Будний день'}
            </div>
          )}
        </div>

        <MarshrutkaWidget onScheduleChange={setSchedule} />
      </div>
    </div>
  )
}

export default App