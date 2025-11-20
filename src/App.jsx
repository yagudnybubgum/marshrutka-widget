import { useState } from 'react'
import MarshrutkaWidget from './components/MarshrutkaWidget'

function App() {
  const [schedule, setSchedule] = useState(null)

  return (
    <div className="min-h-screen bg-base-200 py-6 px-3 sm:py-10 overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 w-full">
        <div className="flex justify-between items-center gap-2">
          <h1 className="text-xl font-normal text-black flex-shrink-0">
            Маршрутка 533
          </h1>
          {schedule && (
            <div className="badge badge-lg font-normal bg-gray-100 text-black rounded-full flex-shrink-0 whitespace-nowrap">
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