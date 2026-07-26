import { copy } from '../../config/copy'

export function formatDirectionName(name) {
  if (!name) return name
  const nameStr = name.toString().trim()

  if (nameStr.includes('Янино') && nameStr.includes('Ладожская')) {
    if (/Янино.*[=_]?[=>].*Ладожская/i.test(nameStr)) {
      return copy.direction.fromYanino
    }
    if (/Ладожская.*[=_]?[=>].*Янино/i.test(nameStr)) {
      return copy.direction.fromLadozhskaya
    }
  }

  if (nameStr.includes('Разметелево')) {
    return copy.direction.fromRazmetelevo
  }

  if (nameStr.includes('Ёксолово') || nameStr.includes('Ексолово')) {
    return copy.direction.fromEksolovo
  }

  if (nameStr.includes('Дубровка')) {
    return copy.direction.fromDubrovka
  }

  if (nameStr.includes('Ладожская')) {
    return copy.direction.fromLadozhskaya
  }

  if (nameStr.includes('МЕГА') || nameStr.includes('Дыбенко')) {
    return copy.direction.fromMega
  }

  if (nameStr.includes('Янино') && !nameStr.includes('Ладожская')) {
    return copy.direction.fromYanino
  }

  return name
}
