export const convertMsToHour = (ms) => {
    let hours = (ms / (1000 * 60 * 60)).toFixed(1);
    return hours
}