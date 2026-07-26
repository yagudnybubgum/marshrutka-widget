import Footer from './Footer'
import { BackLink, PageShell } from './ui'

function About() {
  return (
    <PageShell
      bg="surface"
      maxWidth="4xl"
      padClassName="py-6 px-4 sm:py-10"
      footer={<Footer className="mt-auto" />}
    >
      <BackLink to="/" className="mb-6" />

      <div className="space-y-6 text-ink">
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
          <p className="text-sm text-ink/70 mb-2">Почта для связи:</p>
          <a
            href="mailto:onlineyanino@gmail.com"
            className="text-sm text-ink hover:text-ink/70 transition-colors"
          >
            onlineyanino@gmail.com
          </a>
        </div>
      </div>
    </PageShell>
  )
}

export default About
