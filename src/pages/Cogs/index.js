import React, { useState, useEffect } from 'react'
import { MySwal } from '../../lib/swal.js'
import axios from '../../lib/axios-ss.js'
import queryParams from '../../helpers/queryParams.js';

// Hooks
import { useFetchSummaryCogs, useRefreshPlot, useExportExcelSummaryCogs } from '../../hooks'

// Components
import { Loading } from '../../components'

// Router
import { useHistory, useLocation } from "react-router-dom"

const CogsPage = () => {
	const history = useHistory()
	const location = useLocation()
	const page = queryParams({ path: location.search, key: 'page' })

	const { wbsYear, setWbsYear, wbsMonth, setWbsMonth, group, setGroup, reports, loadingFetchReports, profitCenter, setProfitCenter, totalItemsReport, totalPagesReport, currentPageReport, executeFetchReports, wbsCode, setWbsCode, totalHours } = useFetchSummaryCogs()

	const { setExecuteExportExcel, loadingExportExcel } = useExportExcelSummaryCogs({ wbsYear, wbsMonth, group, profitCenter })

	const { executeRefreshPlot, loadingRefreshPlot } = useRefreshPlot({ fetchPlots: executeFetchReports })

	const handleRenderProfitCenter = profitCenter => {
		if (profitCenter === '0000032201') {
			return 'Corporate Program 32201'
		} else if (profitCenter === '0000032204') {
			return 'Assessment Program 32204'
		} else if (profitCenter === '0000032203') {
			return 'Consultation Program 32203'
		} else if (profitCenter === '0000032101') {
			return 'Short Program 32101'
		} else if (profitCenter === '0000032102') {
			return 'Certification Program 32102'
		} else if (profitCenter === '0000032105') {
			return 'In Company Training 32105'
		} else if (profitCenter === '0000032104') {
			return 'In Company Assessment 32104'
		} else {
			return '-'
		}
	}

	const countingHours = ({ schedules }) => {
		let totalHours = 0

		schedules.forEach(scheduleItem => {
			let duration = (Number(scheduleItem.endHours) - Number(scheduleItem.startHours)) / 1000 / 3600
			totalHours += duration
		})

		return `${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalHours)}`
	}

	const handleGetMonth = ({ fulldateInput }) => {
		const fulldate = new Date(fulldateInput)
		const month = fulldate.getMonth()
		let result = null
		if (month == 0) {
			result = 'January'
		} else if (month == 1) {
			result = 'February'
		} else if (month == 2) {
			result = 'March'
		} else if (month == 3) {
			result = 'April'
		} else if (month == 4) {
			result = 'May'
		} else if (month == 5) {
			result = 'June'
		} else if (month == 6) {
			result = 'July'
		} else if (month == 7) {
			result = 'August'
		} else if (month == 8) {
			result = 'September'
		} else if (month == 9) {
			result = 'October'
		} else if (month == 10) {
			result = 'November'
		} else if (month == 11) {
			result = 'December'
		}

		return result
	}

	useEffect(() => {
		if (!page) {
			history.push(`${location.pathname}?page=1`)
		}
	}, [])

	return (
		<>
			{(loadingFetchReports || loadingRefreshPlot || loadingExportExcel) && <Loading />}
			<div className="content">
				<div className="container-xl">
					{/* Page title */}
					<div className="page-header d-print-none">
						<div className="row align-items-center">
							<div className="col">
								{/* Page pre-title */}
								<div className="page-pretitle">
									Overview
								</div>
								<h2 className="page-title">
									Summary COGS (without Assessment)
								</h2>
							</div>
							{/* Page title actions */}
							<div className="col-auto ms-auto d-print-none">
								<div className="btn-list">
									{/* button action list */}
								</div>
							</div>
						</div>
					</div>
					<>
						<div className="row row-deck row-cards mb-3">
							<div className="card card-md">
								<div className="card-body">
									<div className='row mb-3'>
										<h1 style={{ fontWeight: '600' }}>Filter :</h1>
									</div>
									<div className='row mb-3'>
										<div className='col-lg-2 col-12'>
											<div className="form-floating">
												<select
													className="form-select"
													id="floatingSelect"
													autoComplete="off"
													value={wbsYear}
													onChange={e => setWbsYear(e.target.value)}
												>
													<option value="2022">2022</option>
													<option value="2023">2023</option>
													<option value="2024">2024</option>
												</select>
												<label htmlFor="floatingSelect">Learning Year <span style={{ color: 'red', fontSize: '19px' }}>*</span></label>
											</div>
										</div>
										<div className='col-lg-2 col-12'>
											<div className="form-floating">
												<select
													className="form-select"
													id="floatingSelect"
													autoComplete="off"
													onChange={e => setWbsMonth(e.target.value)}
													value={wbsMonth}
												>
													<option value="0">January</option>
													<option value="1">February</option>
													<option value="2">March</option>
													<option value="3">April</option>
													<option value="4">May</option>
													<option value="5">Jun</option>
													<option value="6">July</option>
													<option value="7">August</option>
													<option value="8">September</option>
													<option value="9">October</option>
													<option value="10">November</option>
													<option value="11">December</option>
												</select>
												<label htmlFor="floatingSelect">Learning Month <span style={{ color: 'red', fontSize: '19px' }}>*</span></label>
											</div>
										</div>
										<div className='col-lg-2 col-12'>
											<div className="form-floating">
												<select
													className="form-select"
													id="floatingSelect"
													autoComplete="off"
													value={group}
													onChange={e => setGroup(e.target.value)}
												>
													<option value="">All</option>
													<option value="APM P">APM P</option>
													<option value="APM C1">APM C1</option>
													<option value="APM C2">APM C2</option>
												</select>
												<label htmlFor="floatingSelect">APM Group</label>
											</div>
										</div>
										<div className='col-lg-2 col-12'>
											<div className="form-floating">
												<input
													className="form-control"
													id="floatingSelect"
													autoComplete="off"
													value={wbsCode}
													onChange={e => setWbsCode(e.target.value)}
												/>
												<label htmlFor="floatingSelect">WBS Code</label>
											</div>
										</div>
										<div className='col-lg-2 col-12'>
											<div className="form-floating">
												<select
													className="form-select"
													id="floatingSelect"
													autoComplete="off"
													value={profitCenter}
													onChange={e => setProfitCenter(e.target.value)}
												>
													<option value="">All</option>
													<option value="0000032201">Corporate Program 32201</option>
													<option value="0000032204">Assessment Program 32204 (DEPRECATED)</option>
													<option value="0000032203">Consultation Program 32203</option>
													<option value="0000032101">Short Program 32101</option>
													<option value="0000032102">Certification Program 32102</option>
													<option value="0000032105">In Company Training 32105</option>
													<option value="0000032104">In Company Assessment 32104 (DEPRECATED)</option>
												</select>
												<label htmlFor="floatingSelect">Profit Center</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="row row-deck row-cards">
							<div className="card card-md" style={{ overflowX: 'scroll' }}>
								<div className="card-body">
									<div className='text-end mb-3'>
										<button
											className='btn btn-sm btn-primary'
											type='button'
											disabled={loadingExportExcel}
											onClick={() => setExecuteExportExcel(true)}
										>
											Export to Excel
										</button>
									</div>
									<div className='row'>
										<table className="table table-bordered table-hover table-sm" style={{ fontSize: '10px' }}>
											<thead>
												<tr>
													<th>Actions</th>
													<th>Profit Canter</th>
													<th>Learning Period</th>
													<th>Company</th>
													<th>WBS Name</th>
													<th>No Project ID & WBS</th>
													<th>APM</th>
													<th>Hours</th>
													<th>SAP ID</th>
													<th>Sales</th>
												</tr>
											</thead>
											<tbody>
												{
													reports.map(reportItem => (
														<tr key={reportItem.id}>
															<td>
																<button
																	type="button"
																	className='btn btn-sm btn-secondary mx-1'
																	onClick={() => executeRefreshPlot(reportItem.id)}
																	disabled={loadingRefreshPlot}
																>
																	Refresh
																</button>
															</td>
															<td>{handleRenderProfitCenter(reportItem.profitCenter)}</td>
															<td>{handleGetMonth({ fulldateInput: new Date(Number(wbsYear), Number(wbsMonth), 1) })}</td>
															<td>{reportItem.client}</td>
															<td>{reportItem.name}</td>
															<td>{reportItem.wbs}</td>
															<td>{reportItem.group}</td>
															<td>{countingHours({ schedules: reportItem.Schedules })}</td>
															<td>{reportItem.sapId || '-'}</td>
															<td>{new Intl.NumberFormat('id', { style: 'currency', currency: 'IDR' }).format(reportItem.sales || 0)}</td>
														</tr>
													))
												}
											</tbody>
										</table>
									</div>

									<div>
										<button
											className='btn btn-sm btn-secondary mx-2'
											type="button"
											disabled={Number(page) == 1}
											onClick={() => {
												if (Number(page) > 0) {
													history.push(`${location.pathname}?page=${(Number(page) - 1)}`)
												}
											}}
										>
											Previous
										</button>
										<span>{`${page} of ${totalPagesReport}`}</span>
										<button
											className='btn btn-sm btn-secondary mx-2'
											type="button"
											onClick={() => {
												if (Number(page) != totalPagesReport) {
													history.push(`${location.pathname}?page=${(Number(page) + 1)}`)
												}
											}}
											disabled={Number(page == totalPagesReport)}
										>
											Next
										</button>
									</div>
									<div className='mt-2 mx-2'>Total Data: {totalItemsReport}</div>
									<div className='text-end'>Total Hours : {`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalHours)} hours`}</div>
								</div>
							</div>
						</div>
					</>
				</div>
			</div>
		</>
	)
}

export default CogsPage
