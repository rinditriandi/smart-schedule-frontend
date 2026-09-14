import { useState, useEffect } from "react";
import axios from '../../lib/axios-ss.js'
import errorHandler from "../../helpers/errorHandler.js";

const useFetchClassTypes = () => {
  const currentUrl = window.location.pathname.split("/");
  const segment_1 = currentUrl[1];

  const [classTypes, setClassTypes] = useState([])
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    try {
      const options = {
        url: `/classTypes`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          appApiName: `scheduleSystem`,
          modApiName: `learning-hours`,
          policy: `read`
        }
      }

      setLoading(true)
      const { data } = await axios(options)

      setClassTypes(data.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      errorHandler({ err: err?.response?.data || err })
    }
  }

  useEffect(() => {
    handleFetch()
  }, [])

  return { classTypes, loadingFetchClassTypes: loading }
}

export default useFetchClassTypes