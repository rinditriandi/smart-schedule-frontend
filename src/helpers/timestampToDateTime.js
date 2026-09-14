export const timestampToDateTime = (theDate) => {

    let year = theDate.substr(0, 4);
    let month = theDate.substr(5, 2);
    let date = theDate.substr(8, 2);
    let hour = theDate.substr(11, 2);
    let minute = theDate.substr(14, 2);

    return `${date}-${month}-${year} ${hour}:${minute}`
}