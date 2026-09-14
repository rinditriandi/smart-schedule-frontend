export const nameOfDay = (theDate) => {
    const days = [
        'Minggu',
        'Senin',
        'Selasa',
        'Rabu',
        'Kamis',
        "Jum'at",
        'Sabtu'
    ]

    const fullDate = new Date(theDate)
    const dayName = days[fullDate.getDay()]

    return `${dayName}`
}