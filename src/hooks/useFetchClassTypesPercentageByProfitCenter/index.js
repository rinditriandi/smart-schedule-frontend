import { useState, useEffect } from "react";
import axios from '../../lib/axios-ss.js'
import errorHandler from "../../helpers/errorHandler.js";
import queryParams from "../../helpers/queryParams.js";

// Router
import { useHistory, useLocation } from "react-router-dom"

const useFetchClassTypesPercentageByProfitCenter = () => {
  const currentUrl = window.location.pathname.split("/");
  const segment_1 = currentUrl[1];
  const [reports, setReports] = useState([])
  const [execute, setExecute] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dateFrom, setDateFrom] = useState()
  const [dateTo, setDateTo] = useState()
  const [isSyncSap, setIsSyncSap] = useState('')
  const [isGcalSync, setIsGcalSync] = useState('')
  const [group, setGroup] = useState('')

  const handleFetch = async () => {
    try {
      setLoading(true)
      console.log('fetch report class types percentage by profit center')
      const { data } = await axios({
        url: `/reports/classTypesPersenByProfitCenter?startHours=${dateFrom.getTime()}&endHours=${dateTo.getTime()}&isSyncSap=${isSyncSap}&isGcalSync=${isGcalSync}&group=${group}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          appApiName: `scheduleSystem`,
          modApiName: `${segment_1}`,
          policy: `read`
        }
      })

      setReports(data.data)
      setExecute(false)
      setLoading(false)
    } catch (err) {
      setReports([])
      setLoading(false)
      setExecute(false)
      errorHandler({ err: err?.response?.data || err })
    }
  }

  useEffect(() => {
    let now = new Date()
    let dateFrom_ = new Date(now.getFullYear(), now.getMonth(), 1)
    let dateTo_ = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    setDateFrom(new Date(dateFrom_))
    setDateTo(new Date(dateTo_))
  }, [])

  useEffect(() => {
    if (dateFrom && dateTo) {
      handleFetch()
    }
  }, [dateFrom, dateTo, isSyncSap, isGcalSync, group])
  useEffect(() => {
    if (execute) {
      handleFetch()
    }
  }, [execute])

  return { executeFetchReports: setExecute, loadingFetchReports: loading, reports, dateFrom, setDateFrom, dateTo, setDateTo, isSyncSap, setIsSyncSap, isGcalSync, setIsGcalSync, group, setGroup }
}

export default useFetchClassTypesPercentageByProfitCenter