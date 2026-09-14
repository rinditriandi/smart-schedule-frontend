import { useState, useEffect } from "react";

import { useLocation } from "react-router-dom";

const useUrlQueryString = () => {
  const { search } = useLocation()
  const [queryString, setQueryString] = useState({})

  useEffect(() => {
    const queryString_ = {}
    const searchParams = new URLSearchParams(search)

    for (const [key, value] of searchParams.entries()) {
      // console.log(`${key}, ${value}`);
      queryString_[key] = value
    }

    setQueryString(queryString_)
  }, [search])

  return { queryString }
}

export default useUrlQueryString