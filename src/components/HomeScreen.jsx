import Footer from './Footer'
import { BackLink, PageShell, PromoCard } from './ui'

const HomeScreen = () => {
  return (
    <PageShell
      fullHeight="full"
      padClassName="pt-6 pb-2 px-4 sm:py-10"
      className="overflow-hidden"
      footer={
        <div className="w-full flex-shrink-0 mt-auto">
          <Footer />
        </div>
      }
    >
      <div className="flex-1 min-h-0 overflow-y-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <BackLink to="/" />
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-normal text-ink mb-2">
            Добавляем ярлык сайта на&nbsp;домашний экран телефона
          </h1>
          <p className="text-base text-ink/70">
            Расписание всегда будет под рукой
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PromoCard
            variant="surface"
            external
            href="https://www.iphones.ru/iNotes/q/kak-v-ios-dobavit-yarlyk-lyubogo-sayta-na-rabochiy-stol"
            title="У меня iPhone"
          />
          <PromoCard
            variant="surface"
            external
            href="https://androidinsider.ru/polezno-znat/kak-dobavit-yarlyk-sajta-na-rabochij-stol-android-smartfona.html"
            title="У меня Android"
          />
        </div>
      </div>
    </PageShell>
  )
}

export default HomeScreen
