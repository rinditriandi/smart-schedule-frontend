import { MySwal } from "../lib/swal"

const errorHandler = ({ err }) => {
  if (err.code === '400' || err.code === '403') {
    let errorsHtml = ``
    if (err?.errors && Array.isArray(err?.errors)) {
      err.errors.forEach(item => {
        errorsHtml += `<li>${item}.</li>`
      })
    }
    return MySwal.fire({
      icon: 'warning',
      title: err?.status || 'error',
      html: `<ul>${errorsHtml}</ul>`
    })
  } else if (err.code === '404') {
    let errorsHtml = ``
    if (err?.errors && Array.isArray(err?.errors)) {
      err.errors.forEach(item => {
        errorsHtml += `<li>${item}.</li>`
      })
    }
    return MySwal.fire({
      icon: 'warning',
      title: err?.status || 'error',
      html: `<ul>${errorsHtml}</ul>`
    })
  } else if (err.code === '401') {
    localStorage.clear()
    MySwal.fire({
      icon: 'error',
      title: 'UNAUTHORIZED',
      text: 'You have to login again'
    })
      .then(() => {
        // window.location.href = 'https://pebs-dev.firebaseapp.com/login'
        // window.location.href = 'https://pebs-dev.adityo.my.id/login'
        window.location.href = 'https://my.prasmul-eli.co/login'
      })
  } else {
    return MySwal.fire({
      icon: 'error',
      title: 'SOMETHING WRONG !',
      text: 'Please contact IT'
    })
  }
}

export default errorHandler