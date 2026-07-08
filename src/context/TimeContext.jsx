import { createContext, useContext, useEffect, useState } from 'react'

const TimeContext = createContext(new Date())

export function TimeProvider({ children }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return <TimeContext.Provider value={now}>{children}</TimeContext.Provider>
}

export function useNow() {
  return useContext(TimeContext)
}
