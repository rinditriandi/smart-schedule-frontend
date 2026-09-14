import axios from 'axios'

const instance = axios.create({
  // baseURL: 'https://registration.prasmul-eli.co/api'
  // baseURL: 'https://pebs-dev.adityo.my.id/api'
  baseURL: 'https://my.prasmul-eli.co/api'
})

export default instance