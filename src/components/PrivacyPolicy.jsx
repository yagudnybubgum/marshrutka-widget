import { Link } from 'react-router-dom'

function PrivacyPolicy() {
  return (
    <div className="min-h-[100dvh] bg-base-200 py-6 px-4 sm:py-10">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/"
          className="text-xs text-black/70 hover:text-black transition-colors inline-block mb-6"
        >
          ← Назад
        </Link>
        
        <div className="bg-white rounded-lg p-6 sm:p-8 space-y-6 text-black">
          <h1 className="text-2xl font-semibold mb-6">Политика конфиденциальности</h1>
          
          <p className="text-sm leading-relaxed">
            Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта yanino.online (далее — «Сайт»).
          </p>

          <section>
            <h2 className="text-lg font-semibold mb-3">1. Общие положения</h2>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>1.1. Использование Сайта означает согласие пользователя с настоящей Политикой конфиденциальности и условиями обработки его персональных данных.</p>
              <p>1.2. В случае несогласия с условиями Политики пользователь должен прекратить использование Сайта.</p>
              <p>1.3. Настоящая Политика применяется только к Сайту yanino.online. Администрация Сайта не контролирует и не несёт ответственность за сайты третьих лиц.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">2. Персональные данные пользователей</h2>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>2.1. В рамках использования Сайта могут автоматически собираться следующие данные:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>IP-адрес пользователя</li>
                <li>данные о браузере и устройстве</li>
                <li>информация о посещённых страницах</li>
                <li>дата и время посещения</li>
                <li>данные файлов cookie</li>
              </ul>
              <p>2.2. Сайт не осуществляет сбор персональных данных, позволяющих прямо идентифицировать пользователя (таких как имя, фамилия, номер телефона, адрес электронной почты и т.п.).</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">3. Использование сервисов аналитики</h2>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>3.1. На Сайте используется сервис веб-аналитики Яндекс.Метрика, предоставляемый ООО «ЯНДЕКС».</p>
              <p>3.2. Яндекс.Метрика использует файлы cookie и другие технологии для анализа поведения пользователей на Сайте.</p>
              <p>3.3. Собранная информация используется исключительно для анализа посещаемости и улучшения работы Сайта.</p>
              <p>3.4. Обработка данных осуществляется в соответствии с Политикой конфиденциальности Яндекса.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">4. Цели обработки персональных данных</h2>
            <p className="text-sm leading-relaxed mb-2">Собранные данные используются для:</p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-sm leading-relaxed">
              <li>анализа посещаемости Сайта</li>
              <li>улучшения качества и удобства использования Сайта</li>
              <li>обеспечения корректной работы Сайта</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">5. Передача данных третьим лицам</h2>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>5.1. Администрация Сайта не передаёт персональные данные пользователей третьим лицам, за исключением случаев, предусмотренных законодательством Российской Федерации.</p>
              <p>5.2. Данные могут передаваться сервису Яндекс.Метрика в рамках его работы.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">6. Защита персональных данных</h2>
            <p className="text-sm leading-relaxed">
              6.1. Администрация Сайта принимает необходимые технические и организационные меры для защиты персональных данных пользователей от неправомерного доступа, изменения, раскрытия или уничтожения.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">7. Права пользователей</h2>
            <p className="text-sm leading-relaxed mb-2">Пользователь имеет право:</p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-sm leading-relaxed">
              <li>получить информацию об обработке его данных</li>
              <li>ограничить использование файлов cookie в настройках своего браузера</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">8. Заключительные положения</h2>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>8.1. Администрация Сайта вправе вносить изменения в настоящую Политику конфиденциальности без согласия пользователя.</p>
              <p>8.2. Актуальная версия Политики всегда доступна на Сайте.</p>
              <p>8.3. Все предложения или вопросы по настоящей Политике можно направлять через контактные данные, указанные на Сайте.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy

