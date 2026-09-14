import React, { useState, useEffect } from 'react'
import { MySwal } from '../../lib/swal.js'
import axios from '../../lib/axios-ss.js'
import queryParams from '../../helpers/queryParams.js';

// React date picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Hooks
import { useFetchLearningHoursByProfitCenter, useExportExcelLearningHoursByProfitCenter } from '../../hooks'

// Router
import { useHistory, useLocation } from "react-router-dom"

// Components
import { Loading } from '../../components'

const LearningHoursByProfitCenterPage = () => {
	const history = useHistory()
	const location = useLocation()
	const page = queryParams({ path: location.search, key: 'page' })

	const { report, loadingFetchReport, executeFetchReport, year, setYear } = useFetchLearningHoursByProfitCenter()

	const { setExecuteExportExcel, loadingExportExcel } = useExportExcelLearningHoursByProfitCenter({ year })

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
									Sum of Learning Hours by Profit Center (without Assessment)
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
										{report && (
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
															<th>Short Program 32101</th>
															<th>Certification Program 32102</th>
															<th>Corporate Program 32201</th>
															<th>ICT 32105</th>
															<th>Consultation Program 32203</th>
														</tr>
													</thead>
													<tbody>
														<tr>
															<td>January</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.shortProgramHoursJanuary)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.certificationProgramHoursJanuary)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.corporateProgramHoursJanuary)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.ictHoursJanuary)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.consultationProgramHoursJanuary)}`}</td>
														</tr>
														<tr>
															<td>February</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.shortProgramHoursFebruary)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.certificationProgramHoursFebruary)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.corporateProgramHoursFebruary)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.ictHoursFebruary)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.consultationProgramHoursFebruary)}`}</td>
														</tr>
														<tr>
															<td>March</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.shortProgramHoursMarch)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.certificationProgramHoursMarch)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.corporateProgramHoursMarch)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.ictHoursMarch)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.consultationProgramHoursMarch)}`}</td>

														</tr>
														<tr>
															<td>April</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.shortProgramHoursApril)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.certificationProgramHoursApril)}`}</td>

															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.corporateProgramHoursApril)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.ictHoursApril)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.consultationProgramHoursApril)}`}</td>

														</tr>
														<tr>
															<td>May</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.shortProgramHoursMay)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.certificationProgramHoursMay)}`}</td>

															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.corporateProgramHoursMay)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.ictHoursMay)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.consultationProgramHoursMay)}`}</td>
														</tr>
														<tr>
															<td>Jun</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.shortProgramHoursJune)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.certificationProgramHoursJune)}`}</td>

															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.corporateProgramHoursJune)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.ictHoursJune)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.consultationProgramHoursJune)}`}</td>
														</tr>
														<tr>
															<td>July</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.shortProgramHoursJuly)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.certificationProgramHoursJuly)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.corporateProgramHoursJuly)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.ictHoursJuly)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.consultationProgramHoursJuly)}`}</td>
														</tr>
														<tr>
															<td>August</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.shortProgramHoursAugust)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.certificationProgramHoursAugust)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.corporateProgramHoursAugust)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.ictHoursAugust)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.consultationProgramHoursAugust)}`}</td>

														</tr>
														<tr>
															<td>September</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.shortProgramHoursSeptember)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.certificationProgramHoursSeptember)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.corporateProgramHoursSeptember)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.ictHoursSeptember)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.consultationProgramHoursSeptember)}`}</td>

														</tr>
														<tr>
															<td>October</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.shortProgramHoursOctober)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.certificationProgramHoursOctober)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.corporateProgramHoursOctober)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.ictHoursOctober)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.consultationProgramHoursOctober)}`}</td>
														</tr>
														<tr>
															<td>November</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.shortProgramHoursNovember)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.certificationProgramHoursNovember)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.corporateProgramHoursNovember)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.ictHoursNovember)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.consultationProgramHoursNovember)}`}</td>
														</tr>
														<tr>
															<td>December</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.shortProgramHoursDecember)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.certificationProgramHoursDecember)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.corporateProgramHoursDecember)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.ictHoursDecember)}`}</td>
															<td>{`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(report.consultationProgramHoursDecember)}`}</td>
														</tr>
													</tbody>
												</table>
											</>
										)}
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

export default LearningHoursByProfitCenterPage
