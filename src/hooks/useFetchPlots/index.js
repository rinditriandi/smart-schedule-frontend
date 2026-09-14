import { useState, useEffect } from "react";
import axios from '../../lib/axios-ss.js'
import errorHandler from "../../helpers/errorHandler.js";
import queryParams from "../../helpers/queryParams.js";

// Router
import { useHistory, useLocation } from "react-router-dom"

const useFetchPlots = () => {
  const history = useHistory()
  const location = useLocation()
  const currentUrl = window.location.pathname.split("/");
  const segment_1 = currentUrl[1];
  const page = queryParams({ path: location.search, key: 'page' })

  const [plots, setPlots] = useState([])
  const [execute, setExecute] = useState(false)
  const [search, setSearch] = useState('')
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setcurrentPage] = useState(page)
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    try {
      console.log('fetch plots')
      const options = {
        url: `/plots?page=${page}&search=${search}`,
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
      setPlots(data.data.items)
      if (Number(page) > data.data.totalPages) {
        history.push(`${location.pathname}?page=1`)
      }
      setTotalItems(data.data.totalItems)
      setTotalPages(data.data.totalPages)
      setcurrentPage(data.data.currentPage)
      setLoading(false)
      setExecute(false)
    } catch (err) {
      setExecute(false)
      setPlots([])
      setLoading(false)
      errorHandler({ err: err?.response?.data || err })
    }
  }

  useEffect(() => {
    if (page) {
      let timeout
      if (search) {
        timeout = setTimeout(() => {
          handleFetch()
        }, 1300)

        return () => clearTimeout(timeout)
      } else {
        handleFetch()
      }
    }
  }, [page, search])

  useEffect(() => {
    if (execute && page) {
      handleFetch()
    }
  }, [execute])

  return { plots, loadingFetchPlots: loading, executeFetchPlots: setExecute, setSearchPlots: setSearch, totalItemsPlot: totalItems, totalPagesPlot: totalPages, searchPlots: search }
}

export default useFetchPlots