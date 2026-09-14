import { useState, useEffect } from "react";
import axios from '../../lib/axios-ss.js'
import errorHandler from "../../helpers/errorHandler.js";

const useFetchConsultants = () => {
  const currentUrl = window.location.pathname.split("/");
  const segment_1 = currentUrl[1];

  const [consultants, setConsultants] = useState([])
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    try {
      setLoading(true)
      const options = {
        url: `/consultants`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          appApiName: `settingManagement`,
          modApiName: `application`,
          policy: `read`
        }
      }
      const { data } = await axios(options)

      setConsultants(data.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      errorHandler({ err: err?.response?.data || err })
    }
  }

  useEffect(() => {
    handleFetch()
  }, [])

  return { consultants, loadingFetchConsultants: loading }
}

export default useFetchConsultants