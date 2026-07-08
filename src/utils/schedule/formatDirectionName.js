export function formatDirectionName(name) {
  if (!name) return name
  const nameStr = name.toString().trim()

  if (nameStr.includes('Янино') && nameStr.includes('Ладожская')) {
    if (/Янино.*[=_]?[=>].*Ладожская/i.test(nameStr)) {
      return 'Из Янино'
    }
    if (/Ладожская.*[=_]?[=>].*Янино/i.test(nameStr)) {
      return 'С Ладожской'
    }
  }

  if (nameStr.includes('Разметелево')) {
    return 'Из Разметелево'
  }

  if (nameStr.includes('Ёксолово') || nameStr.includes('Ексолово')) {
    return 'Из Ёксолово'
  }

  if (nameStr.includes('Дубровка')) {
    return 'Из Дубровки'
  }

  if (nameStr.includes('Ладожская')) {
    return 'С Ладожской'
  }

  if (nameStr.includes('МЕГА') || nameStr.includes('Дыбенко')) {
    return 'От "МЕГА Дыбенко"'
  }

  if (nameStr.includes('Янино') && !nameStr.includes('Ладожская')) {
    return 'Из Янино'
  }

  return name
}
