import { TextLink } from './ui'

function Footer({ className = '' }) {
  return (
    <footer className={`py-6 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <TextLink to="/about" size="xs">
          О проекте
        </TextLink>
        <TextLink to="/privacy-policy" size="xs">
          Политика конфиденциальности
        </TextLink>
      </div>
    </footer>
  )
}

export default Footer
