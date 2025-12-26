import { Link } from 'react-router-dom'

function About() {
  return (
    <div className="min-h-[100dvh] bg-base-200 py-6 px-4 sm:py-10">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/"
          className="text-black hover:text-black/70 transition-colors flex items-center gap-1 text-sm font-normal mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          назад
        </Link>
        
        <div className="bg-white rounded-lg p-6 sm:p-8 space-y-6 text-black">
          <h1 className="text-2xl font-normal mb-6">О проекте</h1>
          
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              Мы — независимые разработчики, которые хотят сделать жизнь жителям Янино чуть проще. 
              Этот проект создан для того, чтобы у вас всегда была под рукой актуальная информация 
              о расписании маршруток.
            </p>
            
            <p>
              Если у вас есть идеи, вопросы или комментарии — мы всегда рады обратной связи. 
              Ваши предложения помогают нам делать проект лучше.
            </p>
          </div>
          
          <div className="pt-6 border-t border-black/10">
            <p className="text-sm text-black/70 mb-2">Почта для связи:</p>
            <a 
              href="mailto:onlineyanino@gmail.com"
              className="text-sm text-black hover:text-black/70 transition-colors"
            >
              onlineyanino@gmail.com
            </a>
          </div>
        </div>
        
        <footer className="mt-6 pb-4">
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
    </div>
  )
}

export default About

