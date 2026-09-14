export const formatDateDb = (theDate) => {
    const fullDate = new Date(theDate)
    let date = `${new Date(fullDate).getDate()}`
    let month = `${new Date(fullDate).getMonth() + 1}`
    let fullYear = `${new Date(fullDate).getFullYear()}`

    if (date.length < 2) date = `0${date}`
    if (month.length < 2) month = `0${month}`

    return `${fullYear}-${month}-${date}`
}