import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://ss.prasmul-eli.co/api'
    // baseURL: 'https://ss-dev.prasmul-eli.co/api'
    // baseURL: 'http://localhost:3001/api'
})

export default instance