import { copy } from '../config/copy'
import { TextLink } from './ui'

function Footer({ className = '' }) {
  return (
    <footer className={`py-6 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <TextLink to="/about" size="xs">
          {copy.nav.about}
        </TextLink>
        <TextLink to="/privacy-policy" size="xs">
          {copy.nav.privacy}
        </TextLink>
      </div>
    </footer>
  )
}

export default Footer
