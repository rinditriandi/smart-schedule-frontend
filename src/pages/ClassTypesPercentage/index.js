import React, { useState, useEffect } from 'react'
import { MySwal } from '../../lib/swal.js'
import axios from '../../lib/axios-ss.js'
import queryParams from '../../helpers/queryParams.js';

// React date picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Hooks
import { useFetchClassTypesPercentage, useExportClassTypesPercentage } from '../../hooks/index.js'

// Components
import { Loading } from '../../components/index.js'

// Router
import { useHistory, useLocation } from "react-router-dom"

import { Modal } from 'react-bootstrap'

const ClassTypesPercentage = () => {
	const [showProfitCenterP, setShowProfitCenterP] = useState(false)
	const [showProfitCenterC1, setShowProfitCenterC1] = useState(false)
	const [showProfitCenterC2, setShowProfitCenterC2] = useState(false)

	const { executeFetchReports, loadingFetchReports, reports, dateFrom, setDateFrom, dateTo, setDateTo, isSyncSap, setIsSyncSap, isGcalSync, setIsGcalSync } = useFetchClassTypesPercentage()

	const { executeExportReports, loadingExportReports } = useExportClassTypesPercentage({ dateFrom, dateTo, isSyncSap, isGcalSync: isGcalSync })

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
									Class Type Percentage
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
										<div className='text-end mb-3'>
											<button
												type='button'
												className='btn btn-sm btn-primary'
												onClick={() => executeExportReports(true)}
											>
												Export to Excel
											</button>
										</div>
										<table style={{ fontSize: '10px' }} className="table table-bordered table-hover">
											<thead>
												<tr>
													<th rowSpan="2">Action</th>
													<th colSpan="2" rowSpan="2">APM / Profit Center</th>
													<th colSpan="2">Onsite</th>
													<th colSpan="2">Onsite Cilandak</th>
													<th colSpan="2">Online</th>
													<th colSpan="2" rowSpan="2">Total Hours</th>
												</tr>
												<tr>
													<th>Persen</th>
													<th>Hours</th>
													<th>Persen</th>
													<th>Hours</th>
													<th>Persen</th>
													<th>Hours</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td className='text-center'><button onClick={() => {
														if (showProfitCenterP) {
															setShowProfitCenterP(false)
														} else {
															setShowProfitCenterP(true)
														}
													}}>{showProfitCenterP ? 'Hide' : 'Show'} Profit Center</button></td>
													<td className='text-center' colSpan="2">APM P</td>
													<td>{reports?.apmPOnsite ? reports.apmPOnsite.toFixed(2) : 0}</td>
													<td>{reports?.apmPOnsiteHours ? reports?.apmPOnsiteHours.toFixed(2) : 0}</td>
													<td>{reports?.apmPOnsiteCilandak ? reports?.apmPOnsiteCilandak.toFixed(2) : 0}</td>
													<td>{reports?.apmPOnsiteCilandakHours ? reports?.apmPOnsiteCilandakHours.toFixed(2) : 0}</td>
													<td>{reports?.apmPOnline ? reports?.apmPOnline.toFixed(2) : 0}</td>
													<td>{reports?.apmPOnlineHours ? reports?.apmPOnlineHours.toFixed(2) : 0}</td>
													<td>{reports?.apmPTotal ? reports?.apmPTotal.toFixed(2) : 0}</td>
												</tr>
												{
													showProfitCenterP && (
														<>
															<tr>
																<td></td>
																<td colSpan="2">Short Program</td>
																<td>{reports?.apmPOnsiteShortProgram ? reports?.apmPOnsiteShortProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteShortProgramHours ? reports?.apmPOnsiteShortProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteCilandakShortProgram ? reports?.apmPOnsiteCilandakShortProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteCilandakShortProgramHours ? reports?.apmPOnsiteCilandakShortProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnlineShortProgram ? reports?.apmPOnlineShortProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnlineShortProgramHours ? reports?.apmPOnlineShortProgramHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
															<tr>
																<td></td>
																<td colSpan="2">Certification Program</td>
																<td>{reports?.apmPOnsiteCertificationProgram ? reports?.apmPOnsiteCertificationProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteCertificationProgramHours ? reports?.apmPOnsiteCertificationProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteCilandakCertificationProgram ? reports?.apmPOnsiteCilandakCertificationProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteCilandakCertificationProgramHours ? reports?.apmPOnsiteCilandakCertificationProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnlineCertificationProgram ? reports?.apmPOnlineCertificationProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnlineCertificationProgramHours ? reports?.apmPOnlineCertificationProgramHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
															<tr>
																<td></td>
																<td colSpan="2">ICT</td>
																<td>{reports?.apmPOnsiteICT ? reports?.apmPOnsiteICT.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteICTHours ? reports?.apmPOnsiteICTHours.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteCilandakICT ? reports?.apmPOnsiteCilandakICT.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteCilandakICTHours ? reports?.apmPOnsiteCilandakICTHours.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnlineICT ? reports?.apmPOnlineICT.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnlineICTHours ? reports?.apmPOnlineICTHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
															<tr>
																<td></td>
																<td colSpan="2">ICA</td>
																<td>{reports?.apmPOnsiteICA ? reports?.apmPOnsiteICA.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteICAHours ? reports?.apmPOnsiteICAHours.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteCilandakICA ? reports?.apmPOnsiteCilandakICA.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteCilandakICAHours ? reports?.apmPOnsiteCilandakICAHours.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnlineICA ? reports?.apmPOnlineICA.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnlineICAHours ? reports?.apmPOnlineICAHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
															<tr>
																<td></td>
																<td colSpan="2">Corporate Program</td>
																<td>{reports?.apmPOnsiteCorporateProgram ? reports?.apmPOnsiteCorporateProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteCorporateProgramHours ? reports?.apmPOnsiteCorporateProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteCilandakCorporateProgram ? reports?.apmPOnsiteCilandakCorporateProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteCilandakCorporateProgramHours ? reports?.apmPOnsiteCilandakCorporateProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnlineCorporateProgram ? reports?.apmPOnlineCorporateProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnlineCorporateProgramHours ? reports?.apmPOnlineCorporateProgramHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
															<tr>
																<td></td>
																<td colSpan="2">Consulting Program</td>
																<td>{reports?.apmPOnsiteConsultingProgram ? reports?.apmPOnsiteConsultingProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteConsultingProgramHours ? reports?.apmPOnsiteConsultingProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteCilandakConsultingProgram ? reports?.apmPOnsiteCilandakConsultingProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteCilandakConsultingProgramHours ? reports?.apmPOnsiteCilandakConsultingProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnlineConsultingProgram ? reports?.apmPOnlineConsultingProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnlineConsultingProgramHours ? reports?.apmPOnlineConsultingProgramHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
															<tr>
																<td></td>
																<td colSpan="2">Assessment Program</td>
																<td>{reports?.apmPOnsiteAssessmentProgram ? reports?.apmPOnsiteAssessmentProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteAssessmentProgramHours ? reports?.apmPOnsiteAssessmentProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteCilandakAssessmentProgram ? reports?.apmPOnsiteCilandakAssessmentProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnsiteCilandakAssessmentProgramHours ? reports?.apmPOnsiteCilandakAssessmentProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnlineAssessmentProgram ? reports?.apmPOnlineAssessmentProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmPOnlineAssessmentProgramHours ? reports?.apmPOnlineAssessmentProgramHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
														</>
													)
												}

												<tr>
													<td className='text-center'><button onClick={() => {
														if (showProfitCenterC1) {
															setShowProfitCenterC1(false)
														} else {
															setShowProfitCenterC1(true)
														}
													}}>{showProfitCenterC1 ? 'Hide' : 'Show'} Profit Center</button></td>
													<td className='text-center' colSpan="2">APM C1</td>
													<td>{reports?.apmC1Onsite ? reports.apmC1Onsite.toFixed(2) : 0}</td>
													<td>{reports?.apmC1OnsiteHours ? reports?.apmC1OnsiteHours.toFixed(2) : 0}</td>
													<td>{reports?.apmC1OnsiteCilandak ? reports?.apmC1OnsiteCilandak.toFixed(2) : 0}</td>
													<td>{reports?.apmC1OnsiteCilandakHours ? reports?.apmC1OnsiteCilandakHours.toFixed(2) : 0}</td>
													<td>{reports?.apmC1Online ? reports?.apmC1Online.toFixed(2) : 0}</td>
													<td>{reports?.apmC1OnlineHours ? reports?.apmC1OnlineHours.toFixed(2) : 0}</td>
													<td>{reports?.apmC1Total ? reports?.apmC1Total.toFixed(2) : 0}</td>
												</tr>
												{
													showProfitCenterC1 && (
														<>
															<tr>
																<td></td>
																<td colSpan="2">Short Program</td>
																<td>{reports?.apmC1OnsiteShortProgram ? reports?.apmC1OnsiteShortProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteShortProgramHours ? reports?.apmC1OnsiteShortProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteCilandakShortProgram ? reports?.apmC1OnsiteCilandakShortProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteCilandakShortProgramHours ? reports?.apmC1OnsiteCilandakShortProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnlineShortProgram ? reports?.apmC1OnlineShortProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnlineShortProgramHours ? reports?.apmC1OnlineShortProgramHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
															<tr>
																<td></td>
																<td colSpan="2">Certification Program</td>
																<td>{reports?.apmC1OnsiteCertificationProgram ? reports?.apmC1OnsiteCertificationProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteCertificationProgramHours ? reports?.apmC1OnsiteCertificationProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteCilandakCertificationProgram ? reports?.apmC1OnsiteCilandakCertificationProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteCilandakCertificationProgramHours ? reports?.apmC1OnsiteCilandakCertificationProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnlineCertificationProgram ? reports?.apmC1OnlineCertificationProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnlineCertificationProgramHours ? reports?.apmC1OnlineCertificationProgramHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
															<tr>
																<td></td>
																<td colSpan="2">ICT</td>
																<td>{reports?.apmC1OnsiteICT ? reports?.apmC1OnsiteICT.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteICTHours ? reports?.apmC1OnsiteICTHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteCilandakICT ? reports?.apmC1OnsiteCilandakICT.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteCilandakICTHours ? reports?.apmC1OnsiteCilandakICTHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnlineICT ? reports?.apmC1OnlineICT.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnlineICTHours ? reports?.apmC1OnlineICTHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
															<tr>
																<td></td>
																<td colSpan="2">ICA</td>
																<td>{reports?.apmC1OnsiteICA ? reports?.apmC1OnsiteICA.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteICAHours ? reports?.apmC1OnsiteICAHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteCilandakICA ? reports?.apmC1OnsiteCilandakICA.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteCilandakICAHours ? reports?.apmC1OnsiteCilandakICAHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnlineICA ? reports?.apmC1OnlineICA.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnlineICAHours ? reports?.apmC1OnlineICAHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
															<tr>
																<td></td>
																<td colSpan="2">Corporate Program</td>
																<td>{reports?.apmC1OnsiteCorporateProgram ? reports?.apmC1OnsiteCorporateProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteCorporateProgramHours ? reports?.apmC1OnsiteCorporateProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteCilandakCorporateProgram ? reports?.apmC1OnsiteCilandakCorporateProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteCilandakCorporateProgramHours ? reports?.apmC1OnsiteCilandakCorporateProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnlineCorporateProgram ? reports?.apmC1OnlineCorporateProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnlineCorporateProgramHours ? reports?.apmC1OnlineCorporateProgramHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
															<tr>
																<td></td>
																<td colSpan="2">Consulting Program</td>
																<td>{reports?.apmC1OnsiteConsultingProgram ? reports?.apmC1OnsiteConsultingProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteConsultingProgramHours ? reports?.apmC1OnsiteConsultingProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteCilandakConsultingProgram ? reports?.apmC1OnsiteCilandakConsultingProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteCilandakConsultingProgramHours ? reports?.apmC1OnsiteCilandakConsultingProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnlineConsultingProgram ? reports?.apmC1OnlineConsultingProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnlineConsultingProgramHours ? reports?.apmC1OnlineConsultingProgramHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
															<tr>
																<td></td>
																<td colSpan="2">Assessment Program</td>
																<td>{reports?.apmC1OnsiteAssessmentProgram ? reports?.apmC1OnsiteAssessmentProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteAssessmentProgramHours ? reports?.apmC1OnsiteAssessmentProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteCilandakAssessmentProgram ? reports?.apmC1OnsiteCilandakAssessmentProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnsiteCilandakAssessmentProgramHours ? reports?.apmC1OnsiteCilandakAssessmentProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnlineAssessmentProgram ? reports?.apmC1OnlineAssessmentProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC1OnlineAssessmentProgramHours ? reports?.apmC1OnlineAssessmentProgramHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
														</>
													)
												}

												<tr>
													<td className='text-center'><button onClick={() => {
														if (showProfitCenterC2) {
															setShowProfitCenterC2(false)
														} else {
															setShowProfitCenterC2(true)
														}
													}}>{showProfitCenterC2 ? 'Hide' : 'Show'} Profit Center</button></td>
													<td className='text-center' colSpan="2">APM C2</td>
													<td>{reports?.apmC2Onsite ? reports.apmC2Onsite.toFixed(2) : 0}</td>
													<td>{reports?.apmC2OnsiteHours ? reports?.apmC2OnsiteHours.toFixed(2) : 0}</td>
													<td>{reports?.apmC2OnsiteCilandak ? reports?.apmC2OnsiteCilandak.toFixed(2) : 0}</td>
													<td>{reports?.apmC2OnsiteCilandakHours ? reports?.apmC2OnsiteCilandakHours.toFixed(2) : 0}</td>
													<td>{reports?.apmC2Online ? reports?.apmC2Online.toFixed(2) : 0}</td>
													<td>{reports?.apmC2OnlineHours ? reports?.apmC2OnlineHours.toFixed(2) : 0}</td>
													<td>{reports?.apmC2Total ? reports?.apmC2Total.toFixed(2) : 0}</td>
												</tr>
												{
													showProfitCenterC2 && (
														<>
															<tr>
																<td></td>
																<td colSpan="2">Short Program</td>
																<td>{reports?.apmC2OnsiteShortProgram ? reports?.apmC2OnsiteShortProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteShortProgramHours ? reports?.apmC2OnsiteShortProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteCilandakShortProgram ? reports?.apmC2OnsiteCilandakShortProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteCilandakShortProgramHours ? reports?.apmC2OnsiteCilandakShortProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnlineShortProgram ? reports?.apmC2OnlineShortProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnlineShortProgramHours ? reports?.apmC2OnlineShortProgramHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
															<tr>
																<td></td>
																<td colSpan="2">Certification Program</td>
																<td>{reports?.apmC2OnsiteCertificationProgram ? reports?.apmC2OnsiteCertificationProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteCertificationProgramHours ? reports?.apmC2OnsiteCertificationProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteCilandakCertificationProgram ? reports?.apmC2OnsiteCilandakCertificationProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteCilandakCertificationProgramHours ? reports?.apmC2OnsiteCilandakCertificationProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnlineCertificationProgram ? reports?.apmC2OnlineCertificationProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnlineCertificationProgramHours ? reports?.apmC2OnlineCertificationProgramHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
															<tr>
																<td></td>
																<td colSpan="2">ICT</td>
																<td>{reports?.apmC2OnsiteICT ? reports?.apmC2OnsiteICT.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteICTHours ? reports?.apmC2OnsiteICTHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteCilandakICT ? reports?.apmC2OnsiteCilandakICT.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteCilandakICTHours ? reports?.apmC2OnsiteCilandakICTHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnlineICT ? reports?.apmC2OnlineICT.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnlineICTHours ? reports?.apmC2OnlineICTHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
															<tr>
																<td></td>
																<td colSpan="2">ICA</td>
																<td>{reports?.apmC2OnsiteICA ? reports?.apmC2OnsiteICA.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteICAHours ? reports?.apmC2OnsiteICAHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteCilandakICA ? reports?.apmC2OnsiteCilandakICA.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteCilandakICAHours ? reports?.apmC2OnsiteCilandakICAHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnlineICA ? reports?.apmC2OnlineICA.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnlineICAHours ? reports?.apmC2OnlineICAHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
															<tr>
																<td></td>
																<td colSpan="2">Corporate Program</td>
																<td>{reports?.apmC2OnsiteCorporateProgram ? reports?.apmC2OnsiteCorporateProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteCorporateProgramHours ? reports?.apmC2OnsiteCorporateProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteCilandakCorporateProgram ? reports?.apmC2OnsiteCilandakCorporateProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteCilandakCorporateProgramHours ? reports?.apmC2OnsiteCilandakCorporateProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnlineCorporateProgram ? reports?.apmC2OnlineCorporateProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnlineCorporateProgramHours ? reports?.apmC2OnlineCorporateProgramHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
															<tr>
																<td></td>
																<td colSpan="2">Consulting Program</td>
																<td>{reports?.apmC2OnsiteConsultingProgram ? reports?.apmC2OnsiteConsultingProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteConsultingProgramHours ? reports?.apmC2OnsiteConsultingProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteCilandakConsultingProgram ? reports?.apmC2OnsiteCilandakConsultingProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteCilandakConsultingProgramHours ? reports?.apmC2OnsiteCilandakConsultingProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnlineConsultingProgram ? reports?.apmC2OnlineConsultingProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnlineConsultingProgramHours ? reports?.apmC2OnlineConsultingProgramHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
															<tr>
																<td></td>
																<td colSpan="2">Assessment Program</td>
																<td>{reports?.apmC2OnsiteAssessmentProgram ? reports?.apmC2OnsiteAssessmentProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteAssessmentProgramHours ? reports?.apmC2OnsiteAssessmentProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteCilandakAssessmentProgram ? reports?.apmC2OnsiteCilandakAssessmentProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnsiteCilandakAssessmentProgramHours ? reports?.apmC2OnsiteCilandakAssessmentProgramHours.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnlineAssessmentProgram ? reports?.apmC2OnlineAssessmentProgram.toFixed(2) : 0}</td>
																<td>{reports?.apmC2OnlineAssessmentProgramHours ? reports?.apmC2OnlineAssessmentProgramHours.toFixed(2) : 0}</td>
																<td></td>
															</tr>
														</>
													)
												}
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

export default ClassTypesPercentage
