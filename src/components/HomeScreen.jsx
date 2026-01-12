import { Link } from 'react-router-dom'

const HomeScreen = () => {
  return (
    <div className="h-[100dvh] bg-base-200 pt-6 pb-2 px-4 sm:py-10 overflow-hidden flex flex-col">
      <div className="max-w-5xl mx-auto space-y-8 w-full flex-1 min-h-0 overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="text-black hover:text-black/70 transition-colors flex items-center gap-1 text-sm font-normal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            назад
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-normal text-black mb-2">
            Добавляем ярлык сайта на&nbsp;домашний экран телефона
          </h1>
          <p className="text-base text-black/70">
            Расписание всегда будет под рукой
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="https://www.iphones.ru/iNotes/q/kak-v-ios-dobavit-yarlyk-lyubogo-sayta-na-rabochiy-stol"
            target="_blank"
            rel="noopener noreferrer"
            className="card bg-base-100 rounded-xl border border-transparent hover:border-gray-300 transition-colors cursor-pointer"
          >
            <div className="card-body p-6">
              <h2 className="text-xl font-normal text-black">У меня iPhone</h2>
            </div>
          </a>

          <a
            href="https://androidinsider.ru/polezno-znat/kak-dobavit-yarlyk-sajta-na-rabochij-stol-android-smartfona.html"
            target="_blank"
            rel="noopener noreferrer"
            className="card bg-base-100 rounded-xl border border-transparent hover:border-gray-300 transition-colors cursor-pointer"
          >
            <div className="card-body p-6">
              <h2 className="text-xl font-normal text-black">У меня Android</h2>
            </div>
          </a>
        </div>
      </div>
      <footer className="max-w-5xl mx-auto w-full py-2 sm:mt-8 sm:pb-4 flex-shrink-0">
        <div className="flex flex-col items-center gap-2">
          <Link 
            to="/privacy-policy"
            className="text-xs text-black/70 text-center hover:text-black transition-colors"
          >
            Политика конфиденциальности
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default HomeScreen

