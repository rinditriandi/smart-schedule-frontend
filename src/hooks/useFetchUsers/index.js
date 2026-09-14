import { useState, useEffect } from "react";
import axios from '../../lib/axios-ss.js'
import errorHandler from "../../helpers/errorHandler.js";

const useFetchUsers = () => {
  const currentUrl = window.location.pathname.split("/");
  const segment_1 = currentUrl[1];

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    try {
      const options = {
        url: `/users`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          appApiName: `scheduleSystem`,
          modApiName: `${segment_1}`,
          policy: `read`
        }
      }
      setLoading(true)
      const { data } = await axios(options)
      setUsers(data.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      errorHandler({ err: err?.response?.data || err })
    }
  }

  useEffect(() => {
    handleFetch()
  }, [])

  return { users, loadingFetchUsers: loading }
}

export default useFetchUsers