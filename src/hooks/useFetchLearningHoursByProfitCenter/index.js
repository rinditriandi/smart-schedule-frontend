import { useState, useEffect } from "react";
import axios from '../../lib/axios-ss.js'
import errorHandler from "../../helpers/errorHandler.js";
import queryParams from "../../helpers/queryParams.js";

// Router
import { useHistory, useLocation } from "react-router-dom"

const useFetchLearningHoursByProfitCenter = () => {
  const history = useHistory()
  const location = useLocation()
  const page = queryParams({ path: location.search, key: 'page' })
  const currentUrl = window.location.pathname.split("/");
  const segment_1 = currentUrl[1];
  const [report, setReport] = useState(null)
  const [year, setYear] = useState(`${new Date().getFullYear()}`)
  const [execute, setExecute] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    try {
      setLoading(true)
      console.log('fetch report learning hours by profit center')
      const { data } = await axios({
        url: `/reports/learningHoursByProfitCenter?year=${year}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          appApiName: `scheduleSystem`,
          modApiName: segment_1,
          policy: `read`
        }
      })

      setReport(data.data)
      setExecute(false)
      setLoading(false)
    } catch (err) {
      setReport(null)
      setLoading(false)
      setExecute(false)
      errorHandler({ err: err?.response?.data || err })
    }
  }

  useEffect(() => {
    handleFetch()
  }, [year])

  useEffect(() => {
    if (execute) {
      handleFetch()
    }
  }, [execute])

  return { executeFetchReport: setExecute, loadingFetchReport: loading, report, year, setYear }
}

export default useFetchLearningHoursByProfitCenter