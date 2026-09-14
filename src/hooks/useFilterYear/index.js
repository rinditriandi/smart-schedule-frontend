import { useState, useEffect } from "react";

const useFilterYear = () => {
  const [selectedYear, setSelectedYear] = useState('')
  const [listYear, setListYear] = useState([])

  useEffect(() => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    setSelectedYear(`${currentYear}`)

    let year_ = currentYear - 2
    const listYear_ = []

    for (let i = 0; i < 5; i++) {
      listYear_.push(`${year_}`)
      year_ += 1
    }

    setListYear(listYear_)
  }, [])

  return { selectedYear, setSelectedYear, listYear }
}

export default useFilterYear