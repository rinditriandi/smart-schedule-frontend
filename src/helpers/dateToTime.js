export const dateToTime = (theDate) => {
    let fullDate = new Date(theDate)
    let time = `${new Date(fullDate).getTime()}`

    return `${time}`
}