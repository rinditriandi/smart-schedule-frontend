export const timestampToDate = (theDate) => {

    let year = theDate.substr(0, 4);
    let month = theDate.substr(5, 2);
    let date = theDate.substr(8, 2);

    return `${date}-${month}-${year}`
}