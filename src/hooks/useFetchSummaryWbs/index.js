import { useState, useEffect } from "react";
import axios from '../../lib/axios-ss.js'
import errorHandler from "../../helpers/errorHandler.js";
import queryParams from "../../helpers/queryParams.js";

// Router
import { useHistory, useLocation } from "react-router-dom"

const useFetchSummaryWbs = () => {
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
  const [wbsYear, setWbsYear] = useState(`${new Date().getFullYear()}`)
  const [wbsMonth, setWbsMonth] = useState(`${new Date().getMonth()}`)
  const [profitCenter, setProfitCenter] = useState('')
  const [wbsCode, setWbsCode] = useState('')
  const [totalHours, setTotalHours] = useState(0)
  const [group, setGroup] = useState('')

  const handleFetch = async () => {
    try {
      setLoading(true)
      console.log('fetch report summary cogs')
      const { data } = await axios({
        url: `/reports/summaryWbs?page=${page}&year=${wbsYear}&group=${group}&profitCenter=${profitCenter}&wbsCode=${wbsCode}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          appApiName: `scheduleSystem`,
          modApiName: `${segment_1}`,
          policy: `read`
        }
      })

      setReports(data.data.items)
      setTotalHours(data.data.totalHours)
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
    if (wbsYear && wbsMonth && page) {
      handleFetch()
    }
  }, [wbsYear, wbsMonth, group, profitCenter, page, wbsCode])
  useEffect(() => {
    if (execute) {
      handleFetch()
    }
  }, [execute])

  return { executeFetchReports: setExecute, loadingFetchReports: loading, reports, totalItemsReport: totalItems, totalPagesReport: totalPages, currentPageReport: currentPage, wbsYear, setWbsYear, group, setGroup, profitCenter, setProfitCenter, wbsCode, setWbsCode, totalHours }

}

export default useFetchSummaryWbs