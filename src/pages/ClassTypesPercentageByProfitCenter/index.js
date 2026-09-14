import React, { useState, useEffect } from 'react'
import { MySwal } from '../../lib/swal.js'
import axios from '../../lib/axios-ss.js'
import queryParams from '../../helpers/queryParams.js';

// React date picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Hooks
import { useFetchClassTypesPercentageByProfitCenter } from '../../hooks/index.js'

// Components
import { Loading } from '../../components/index.js'

// Router
import { useHistory, useLocation } from "react-router-dom"

import { Modal } from 'react-bootstrap'

const ClassTypesPercentageByProfitCenter = () => {
	const { executeFetchReports, loadingFetchReports, reports, dateFrom, setDateFrom, dateTo, setDateTo, isSyncSap, setIsSyncSap, isGcalSync, setIsGcalSync, group, setGroup } = useFetchClassTypesPercentageByProfitCenter()
	console.log(reports)

	// const { setExecuteExportExcel, loadingExportExcel } = useExportExcelLearningHoursForApm({ startHours: dateFrom, endHours: dateTo, group, profitCenter, consultantId: consultant, isSyncSap })

	return (
		<>
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
									Class Type Percentage by Profit Center
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
											<label className='form-label'>Start Date</label>
											<DatePicker
												className='form-control'
												selected={dateFrom}
												onChange={(date) => setDateFrom(date)}
											/>
										</div>
										<div className='col-lg-2 col-12'>
											<label className='form-label'>End Date</label>
											<DatePicker
												className='form-control'
												selected={dateTo}
												onChange={(date) => setDateTo(date)}
											/>
										</div>
										<div className='col-lg-2 col-12'>
											<label className='form-label'>APM</label>
											<select
												className='form-select'
												value={group}
												onChange={e => setGroup(e.target.value)}
											>
												<option value="">All</option>
												<option value="APM P">APM P</option>
												<option value="APM C1">APM C1</option>
												<option value="APM C2">APM C2</option>
											</select>
										</div>
										<div className='col-lg-2 col-12'>
											<label className='form-label'>Sync to SAP</label>
											<select
												className='form-select'
												value={isSyncSap}
												onChange={e => setIsSyncSap(e.target.value)}
											>
												<option value="">All</option>
												<option value="true">True</option>
												<option value="false">False</option>
											</select>
										</div>
										<div className='col-lg-2 col-12'>
											<label className='form-label'>Gcal Status</label>
											<select
												className='form-select'
												value={isGcalSync}
												onChange={e => setIsGcalSync(e.target.value)}
											>
												<option value="">All</option>
												<option value="true">Sync</option>
												<option value="false">Not Sync</option>
											</select>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="row row-deck row-cards">
							<div className="card card-md" style={{ overflowX: 'scroll' }}>
								<div className="card-body">
									<div className='row'>
										{/* <div className='text-end mb-3'>
											<button
												type='button'
												className='btn btn-sm btn-primary'
											// onClick={() => setExecuteExportExcel(true)}
											>
												Export to Excel
											</button>
										</div> */}
										<table style={{ fontSize: '10px' }} className="table table-bordered table-hover">
											<thead>
												<tr>
													<th>Profit Center</th>
													<th>Onsite</th>
													<th>Onsite Cilandak</th>
													<th>Online</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>Short Program</td>
													<td>{reports?.shortProgramOnsite || '0'}</td>
													<td>{reports?.shortProgramOnsiteCilandak || '0'}</td>
													<td>{reports?.shortProgramOnline || '0'}</td>
												</tr>
												<tr>
													<td>Certification Program</td>
													<td>{reports?.certificationProgramOnsite || '0'}</td>
													<td>{reports?.certificationProgramOnsiteCilandak || '0'}</td>
													<td>{reports?.certificationProgramOnline || '0'}</td>
												</tr>
												<tr>
													<td>ICT</td>
													<td>{reports?.ictOnsite || '0'}</td>
													<td>{reports?.ictOnsiteCilandak || '0'}</td>
													<td>{reports?.ictOnline || '0'}</td>
												</tr>
												<tr>
													<td>ICA</td>
													<td>{reports?.icaOnsite || '0'}</td>
													<td>{reports?.icaOnsiteCilandak || '0'}</td>
													<td>{reports?.icaOnline || '0'}</td>
												</tr>
												<tr>
													<td>Corporate Program</td>
													<td>{reports?.corporateProgramOnsite || '0'}</td>
													<td>{reports?.corporateProgramOnsiteCilandak || '0'}</td>
													<td>{reports?.corporateProgramOnline || '0'}</td>
												</tr>
												<tr>
													<td>Consultation Program</td>
													<td>{reports?.consultationProgramOnsite || '0'}</td>
													<td>{reports?.consultationProgramOnsiteCilandak || '0'}</td>
													<td>{reports?.consultationProgramOnline || '0'}</td>
												</tr>
												<tr>
													<td>Assessment Program</td>
													<td>{reports?.assessmentProgramOnsite || '0'}</td>
													<td>{reports?.assessmentProgramOnsiteCilandak || '0'}</td>
													<td>{reports?.assessmentProgramOnline || '0'}</td>
												</tr>
											</tbody>
										</table>
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

export default ClassTypesPercentageByProfitCenter
