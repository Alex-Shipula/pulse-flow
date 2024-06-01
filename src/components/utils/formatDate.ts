export function formatDate (dateString: string) {
  const date = new Date(dateString)
  const day = date?.getDate().toString().padStart(2, '0')
  const month = date?.toLocaleString('default', { month: 'numeric' }).padStart(2, '0')
  const year = date?.getFullYear()
  const formattedDate1 = `${day} / ${month}`
  const monthName = date?.toLocaleString('default', { month: 'short' })
  const formattedMonthName = monthName.replace('.', '')
  const formattedDate2 = `${day} / ${formattedMonthName} / ${year}`

  return {
    format1: formattedDate1,
    format2: formattedDate2
  }
}
