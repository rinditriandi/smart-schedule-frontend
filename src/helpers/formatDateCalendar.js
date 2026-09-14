export const formatDateCalendar = (theDate) => {
    const fullDate = new Date(theDate)
    let date = `${new Date(fullDate).getDate()}`
    let month = `${new Date(fullDate).getMonth()}`
    let fullYear = `${new Date(fullDate).getFullYear()}`
    let hours = `${new Date(fullDate).getHours()}`
    let minutes = `${new Date(fullDate).getMinutes()}`

    if (date.length < 2) date = `0${date}`
    if (month.length < 2) month = `0${month}`
    if (hours.length < 2) hours = `0${hours}`
    if (minutes.length < 2) minutes = `0${minutes}`

    //return `${fullYear}-${month}-${date} ${hours}:${minutes}:00`
    return new Date(fullYear, month, date, hours, minutes)
}