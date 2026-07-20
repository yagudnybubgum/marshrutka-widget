import { Link } from 'react-router-dom'
import Footer from './Footer'
import { ChevronLeftIcon } from './icons'

function About() {
  return (
    <div className="min-h-[100dvh] bg-white py-6 px-4 sm:py-10 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <Link 
          to="/"
          className="text-black hover:text-black/70 transition-colors flex items-center gap-1 text-sm font-normal mb-6"
        >
          <ChevronLeftIcon />
          назад
        </Link>
        
        <div className="space-y-6 text-black">
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
          
          <div className="pt-6">
            <p className="text-sm text-black/70 mb-2">Почта для связи:</p>
            <a 
              href="mailto:onlineyanino@gmail.com"
              className="text-sm text-black hover:text-black/70 transition-colors"
            >
              onlineyanino@gmail.com
            </a>
          </div>
        </div>
        
        <Footer className="mt-auto" />
      </div>
    </div>
  )
}

export default About

