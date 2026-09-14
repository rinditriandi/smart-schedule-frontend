export const numberFormat = (number) => {
  if (number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return null
  }
}