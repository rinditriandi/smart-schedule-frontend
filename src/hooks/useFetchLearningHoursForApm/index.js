import { useState, useEffect } from "react";
import axios from '../../lib/axios-ss.js'
import errorHandler from "../../helpers/errorHandler.js";
import queryParams from "../../helpers/queryParams.js";

// Router
import { useHistory, useLocation } from "react-router-dom"

const useFetchLearningHoursForApm = () => {
  const history = useHistory()
  const location = useLocation()
  const page = queryParams({ path: location.search, key: 'page' })
  const currentUrl = window.location.pathname.split("/");
  const segment_1 = currentUrl[1];
  const [reports, setReports] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setcurrentPage] = useState(page)
  const [execute, setExecute] = useState(false)
  const [loading, setLoading] = useState(false)
  const [consultant, setConsultant] = useState('')
  const [dateFrom, setDateFrom] = useState()
  const [dateTo, setDateTo] = useState()
  const [profitCenter, setProfitCenter] = useState('')
  const [group, setGroup] = useState('')
  const [isSyncSap, setIsSyncSap] = useState('')
  const [isGcalSync, setIsGcalSync] = useState('')
  const [totalDurationMilliseconds, setTotalDurationMilliseconds] = useState(null)

  const handleFetch = async () => {
    try {
      setLoading(true)
      console.log('fetch report learning hours for apm')
      const { data } = await axios({
        url: `/reports/learningHoursForApm?page=${page}&startHours=${dateFrom.getTime()}&endHours=${dateTo.getTime()}&group=${group}&profitCenter=${profitCenter}&consultantId=${consultant}&isSyncSap=${isSyncSap}&isGcalSync=${isGcalSync}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          appApiName: `scheduleSystem`,
          modApiName: `${segment_1}`,
          policy: `read`
        }
      })

      setReports(data.data.items)
      setTotalDurationMilliseconds(data.data.totalDurationMilliseconds)
      if (Number(page) > data.data.totalPages) {
        history.push(`${location.pathname}?page=1`)
      }
      setTotalItems(data.data.totalItems)
      setTotalPages(data.data.totalPages)
      setcurrentPage(data.data.currentPage)
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
    if (dateFrom && dateTo && page) {
      handleFetch()
    }
  }, [dateFrom, dateTo, group, profitCenter, page, consultant, isSyncSap, isGcalSync])
  useEffect(() => {
    if (execute) {
      handleFetch()
    }
  }, [execute])

  return { executeFetchReports: setExecute, loadingFetchReports: loading, reports, totalItemsReport: totalItems, totalPagesReport: totalPages, currentPageReport: currentPage, dateFrom, setDateFrom, dateTo, setDateTo, group, setGroup, profitCenter, setProfitCenter, consultant, setConsultant, totalDurationMilliseconds, isSyncSap, setIsSyncSap, isGcalSync, setIsGcalSync }
}

export default useFetchLearningHoursForApm