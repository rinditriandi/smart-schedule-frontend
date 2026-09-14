export const numberToDateTime = (paramDate) => {
    // const number = new Date(paramDate)
    let fullDate = `${new Date(paramDate).toUTCString()}`

    return `${new Date(fullDate).getFullYear()}-${`${new Date(fullDate).getMonth() + 1}`.padStart(2, 0)}-${`${new Date(fullDate).getDate()}`.padStart(2, 0)}T${`${new Date(fullDate).getHours()}`.padStart(2, 0)}:${`${new Date(fullDate).getMinutes()}`.padStart(2, 0)}`
}