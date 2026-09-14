import React, { useState, useEffect } from 'react'
import { MySwal } from '../../lib/swal.js'
import axios from '../../lib/axios-ss.js'
import { dateToTime } from '../../helpers/dateToTime.js'
import { formatDate } from '../../helpers/formatDate.js';

// Error Handler
import errorHandler from '../../helpers/errorHandler.js';

// Hooks
import { useFilterMonth, useFilterYear, useFetchConsultants, useFetchTimeoff, useFetchTimeoffTypes, useUrlQueryString } from '../../hooks'

// Components
import Loading from '../../components/moleculs/Loading/index.js'
import CreateTimeoff from '../../components/moleculs/Timeoff/createTimeoff.js';
import UpdateTimeoff from '../../components/moleculs/Timeoff/updateTimeoff.js';

// Assets
import dataNotFoundImg from '../../assets/images/data-not-found.jpg'

// Router
import { useHistory } from 'react-router-dom';

const Timeoff = () => {
  const history = useHistory()
  const { queryString } = useUrlQueryString()

  const { selectedMonth, setSelectedMonth } = useFilterMonth()
  const { selectedYear, setSelectedYear, listYear } = useFilterYear()
  const { consultants } = useFetchConsultants()
  const { timeoffTypes } = useFetchTimeoffTypes()

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [consultant, setConsultant] = useState('')
  const [activityType, setActivityType] = useState('')

  const { timeoff, loadingFetchTimeoff, executeFetchTimeoff } = useFetchTimeoff({ dateFrom, dateTo, ConsultantId: consultant, activityType })

  const handleDelete = async ({ deletedTimeoff }) => {
    try {
      const resultSwal = await MySwal.fire({
        icon: 'question',
        text: `Do you want to delete timeoff ${deletedTimeoff.id} ?`,
        showCancelButton: true,
        showConfirmButton: true
      })

      if (!resultSwal.isConfirmed) return false

      const options = {
        url: `/timeoff/${deletedTimeoff.id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          appApiName: `scheduleSystem`,
          modApiName: `time-off`,
          policy: `read`
        }
      }
      await axios(options)
      MySwal.fire({
        icon: 'success',
        text: `timeoff ${deletedTimeoff.id} has been deleted`,
        position: 'top-end',
        timer: 1500,
        showCancelButton: false,
        showConfirmButton: false
      })
      executeFetchTimeoff(true)
    } catch (err) {
      errorHandler({ err: err?.response?.data || err })
    }
  }

  useEffect(() => {
    if (selectedMonth) {
      let dateFrom_ = new Date()
      dateFrom_.setHours(0, 0, 0, 0)
      dateFrom_.setMonth(Number(selectedMonth))
      dateFrom_.setDate(1)
      dateFrom_.setFullYear(Number(selectedYear))
      const dateTo_ = new Date(dateFrom_.getFullYear(), dateFrom_.getMonth() + 1, 0)

      setDateFrom(dateFrom_.getTime())
      setDateTo(dateTo_.getTime())
    }
  }, [selectedMonth, selectedYear])

  return (
    <>
      {
        loadingFetchTimeoff && <Loading />
      }
      <div className="content">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                {/* Page pre-title */}
                <div className="page-pretitle">
                  Overview
                </div>
                <h2 className="page-title">
                  Time-off
                </h2>
              </div>
            </div>
          </div>

          <div className="row row-deck row-cards mb-3">
            <div className="card card-md">
              <div className="card-body">

                <div className='row mb-3'>
                  <div className='col-lg-3 col-12'>
                    <div className="form-floating">
                      <select
                        className="form-select"
                        autoComplete="off"
                        value={consultant}
                        onChange={e => setConsultant(e.target.value)}
                      >
                        <option value="">All</option>
                        {
                          consultants.map(consultant => (
                            <option value={consultant.id}>{consultant.name}</option>
                          ))
                        }
                      </select>
                      <label htmlFor="floatingSelect">Consultants</label>
                    </div>
                  </div>
                  <div className='col-lg-3 col-12'>
                    <div className="form-floating">
                      <select
                        className="form-select"
                        autoComplete="off"
                        value={selectedMonth}
                        onChange={e => setSelectedMonth(e.target.value)}
                      >
                        <option value="0">January</option>
                        <option value="1">February</option>
                        <option value="2">March</option>
                        <option value="3">April</option>
                        <option value="4">May</option>
                        <option value="5">June</option>
                        <option value="6">July</option>
                        <option value="7">August</option>
                        <option value="8">September</option>
                        <option value="9">October</option>
                        <option value="10">November</option>
                        <option value="11">December</option>
                      </select>
                      <label htmlFor="floatingSelect">Month</label>
                    </div>
                  </div>
                  <div className='col-lg-3 col-12'>
                    <div className="form-floating">
                      <select
                        className="form-select"
                        autoComplete="off"
                        onChange={e => setSelectedYear(e.target.value)}
                        value={selectedYear}
                      >
                        {
                          listYear.map(year => (
                            <option
                              key={year}
                              value={year}
                            >
                              {year}
                            </option>
                          ))
                        }
                      </select>
                      <label htmlFor="floatingSelect">Year</label>
                    </div>
                  </div>
                  <div className='col-lg-3 col-12'>
                    <div className="form-floating">
                      <select
                        className="form-select"
                        autoComplete="off"
                        value={activityType}
                        onChange={e => setActivityType(e.target.value)}
                      >
                        <option value="">All</option>
                        {
                          timeoffTypes.map(type => (
                            <option key={type.id} value={type.ActivityTypeId}>{type.label}</option>
                          ))
                        }
                      </select>
                      <label htmlFor="floatingSelect">Time-off Type</label>
                    </div>
                  </div>
                </div>

                <div className='row mt-4 justify-content-end'>
                  <div className='col-3 text-end'>
                    <button
                      type="button"
                      className='btn btn-success'
                      onClick={() => history.push('/time-off?create=true')}
                    >
                      Create new Timeoff
                    </button>
                  </div>
                </div>

                {
                  timeoff.length === 0 ?
                    <div className='text-center'>
                      <img
                        alt='data-not-found'
                        style={{ width: '38%' }}
                        src={dataNotFoundImg}
                      />
                    </div>
                    :
                    <div className='row mt-3'>
                      <table className="table table-hover text-center">
                        <thead>
                          <tr>
                            <th></th>
                            <th>Consultant</th>
                            <th>Type</th>
                            <th>Notes</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            timeoff.map(item => (
                              <tr
                                key={item.id}
                              >
                                <td>
                                  <div className="dropdown">
                                    <button className="btn btn-primary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                      Actions
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                      <li>
                                        <button
                                          className="dropdown-item btn btn-sm"
                                          type="button"
                                          onClick={() => history.push(`/time-off?update=${item.id}`)}
                                        >
                                          Update
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          className="dropdown-item btn btn-sm"
                                          type="button"
                                          onClick={() => handleDelete({ deletedTimeoff: item })}
                                        >
                                          Delete
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                </td>
                                <td>
                                  {
                                    item.Consultants.map(consultantItem => (
                                      <li key={consultantItem.id}>{consultantItem?.alias}</li>
                                    ))
                                  }
                                </td>
                                <td>{item.ActivityType.label}</td>
                                <td>{item.description}</td>
                                <td>{new Intl.DateTimeFormat('id').format(new Date(item.startHours))}</td>
                                <td>{new Intl.DateTimeFormat('id').format(new Date(item.endHours))}</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                }

              </div>
            </div>
          </div>
        </div>
      </div>

      {
        queryString?.create === 'true' && <CreateTimeoff executeFetchTimeoff={executeFetchTimeoff} />
      }
      {
        queryString?.update && <UpdateTimeoff executeFetchTimeoff={executeFetchTimeoff} />
      }
    </>
  )
}

export default Timeoff