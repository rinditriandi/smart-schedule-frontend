export const arrayToString = (consultants) => {
    const stringData = consultants.reduce((result, item) => {
        return `${result}${item.alias},`
    }, "")

    return stringData
}