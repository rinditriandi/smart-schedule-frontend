import { useState, useEffect } from "react";
import axios from '../../lib/axios-ss.js'
import errorHandler from "../../helpers/errorHandler.js";

const useRefreshPlot = ({ fetchPlots }) => {
  const currentUrl = window.location.pathname.split("/");
  const segment_1 = currentUrl[1];

  const [execute, setExecute] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    try {
      const options = {
        url: `/plots/refresh/${execute}`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          appApiName: `scheduleSystem`,
          modApiName: `${segment_1}`,
          policy: `read`
        }
      }
      setLoading(true)
      await axios(options)
      fetchPlots(true)
      setExecute(null)
      setLoading(false)
    } catch (err) {
      setExecute(null)
      setLoading(false)
      errorHandler({ err: err?.response?.data || err })
    }
  }

  useEffect(() => {
    if (execute) {
      handleFetch()
    }
  }, [execute])

  return { executeRefreshPlot: setExecute, loadingRefreshPlot: loading }
}

export default useRefreshPlot