export const numberToTime = (param) => {
    // const number = new Date(param)
    let fullDate = `${new Date(param).toUTCString()}`

    // const fullDate = new Date(param).toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
    let hours = `${new Date(fullDate).getHours()}`
    let minutes = `${new Date(fullDate).getMinutes()}`

    if (hours.length < 2) hours = `0${hours}`
    if (minutes.length < 2) minutes = `0${minutes}`

    return `${hours}:${minutes}`
}