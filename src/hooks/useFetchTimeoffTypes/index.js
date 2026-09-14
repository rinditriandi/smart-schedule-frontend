import { useState, useEffect } from "react";
import axios from '../../lib/axios-ss.js'
import errorHandler from "../../helpers/errorHandler.js";

const useFetchTimeoffTypes = () => {
  const currentUrl = window.location.pathname.split("/");
  const segment_1 = currentUrl[1];

  const [timeoffTypes, setTimeoffTypes] = useState([])
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    try {
      const options = {
        url: `/timeoff/types`,
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
      setTimeoffTypes(data.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      errorHandler({ err: err?.response?.data || err })
    }
  }

  useEffect(() => {
    handleFetch()
  }, [])

  return { timeoffTypes, loadingFetchTimeoffTypes: loading }
}

export default useFetchTimeoffTypes