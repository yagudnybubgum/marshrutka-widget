import MarshrutkaWidget from './components/MarshrutkaWidget'

function App() {
  return (
    <div className="min-h-screen bg-base-200 py-6 px-3 sm:py-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-normal text-base-content">
            Маршрутка 533
          </h1>
        </div>

        <div className="card bg-base-100">
          <div className="card-body">
            <MarshrutkaWidget />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App