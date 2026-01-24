import { Link } from 'react-router-dom'

function Footer({ className = '' }) {
  return (
    <footer className={`py-6 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <Link 
          to="/about"
          className="text-xs text-black/70 text-center hover:text-black transition-colors"
        >
          О проекте
        </Link>
        <Link 
          to="/privacy-policy"
          className="text-xs text-black/70 text-center hover:text-black transition-colors"
        >
          Политика конфиденциальности
        </Link>
      </div>
    </footer>
  )
}

export default Footer
