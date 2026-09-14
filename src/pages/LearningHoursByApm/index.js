import React, { useState, useEffect } from 'react'
import { MySwal } from '../../lib/swal.js'
import axios from '../../lib/axios-ss.js'
import queryParams from '../../helpers/queryParams.js';

// React date picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Hooks
import { useFetchLearningHoursByApm, useExportExcelLearningHoursByApm } from '../../hooks/index.js'

// Router
import { useHistory, useLocation } from "react-router-dom"

// Components
import { Loading } from '../../components'

const LearningHoursByApmPage = () => {
	const history = useHistory()
	const location = useLocation()
	const page = queryParams({ path: location.search, key: 'page' })

	const { report, loadingFetchReport, executeFetchReport, year, setYear } = useFetchLearningHoursByApm()

	const { setExecuteExportExcel, loadingExportExcel } = useExportExcelLearningHoursByApm({ year })

	useEffect(() => {
		if (!page) {
			history.push(`${location.pathname}?page=1`)
		}
	}, [])

	return (
		<>
			{(loadingFetchReport || loadingExportExcel) && <Loading />}
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
									Learning Hours by APM (without Assessment)
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
													value={year}
													onChange={e => setYear(e.target.value)}
												>
													<option value={`${new Date().getFullYear() - 1}`}>{`${new Date().getFullYear() - 1}`}</option>
													<option value={`${new Date().getFullYear()}`}>{`${new Date().getFullYear()}`}</option>
													<option value={`${new Date().getFullYear() + 1}`}>{`${new Date().getFullYear() + 1}`}</option>
												</select>
												<label htmlFor="floatingSelect">Year</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="row row-deck row-cards">
							<div className="card card-md" style={{ overflowX: 'scroll' }}>
								<div className="card-body">
									<div className='row'>
										{
											report && (
												<>
													<div className='text-end'>
														<button
															type='button'
															className='btn btn-primary btn-sm mb-3'
															onClick={() => setExecuteExportExcel(true)}
															disabled={loadingExportExcel}
														>
															Export to Excel
														</button>
													</div>
													<table className="table table-bordered table-hover">
														<thead>
															<tr>
																<th></th>
																<th>APM P</th>
																<th>APM C1</th>
																<th>APM C2</th>
															</tr>
														</thead>
														<tbody>
															<tr>
																<td>January</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmpHoursJanuary)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc1HoursJanuary)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc2HoursJanuary)}`}</td>
															</tr>
															<tr>
																<td>February</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmpHoursFebruary)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc1HoursFebruary)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc2HoursFebruary)}`}</td>
															</tr>
															<tr>
																<td>March</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmpHoursMarch)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc1HoursMarch)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc2HoursMarch)}`}</td>
															</tr>
															<tr>
																<td>April</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmpHoursApril)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc1HoursApril)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc2HoursApril)}`}</td>
															</tr>
															<tr>
																<td>May</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmpHoursMay)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc1HoursMay)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc2HoursMay)}`}</td>
															</tr>
															<tr>
																<td>Jun</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmpHoursJune)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc1HoursJune)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc2HoursJune)}`}</td>
															</tr>
															<tr>
																<td>July</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmpHoursJuly)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc1HoursJuly)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc2HoursJuly)}`}</td>
															</tr>
															<tr>
																<td>August</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmpHoursAugust)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc1HoursAugust)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc2HoursAugust)}`}</td>
															</tr>
															<tr>
																<td>September</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmpHoursSeptember)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc1HoursSeptember)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc2HoursSeptember)}`}</td>
															</tr>
															<tr>
																<td>October</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmpHoursOctober)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc1HoursOctober)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc2HoursOctober)}`}</td>
															</tr>
															<tr>
																<td>November</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmpHoursNovember)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc1HoursNovember)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc2HoursNovember)}`}</td>
															</tr>
															<tr>
																<td>December</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmpHoursDecember)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc1HoursDecember)}`}</td>
																<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.apmc2HoursDecember)}`}</td>
															</tr>
														</tbody>
													</table>
												</>
											)
										}
									</div>
								</div>
							</div>
						</div>
					</>
				</div>
			</div>
		</>
	)
}

export default LearningHoursByApmPage
