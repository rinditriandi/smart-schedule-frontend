import React, { useState, useEffect } from 'react'
import { numberToDate } from '../../../helpers/numberToDate'
import { numberToTime } from '../../../helpers/numberToTime'
import { Badge, Spinner } from 'react-bootstrap'
import axios from '../../../lib/axios-ss.js'
import { MySwal } from '../../../lib/swal.js'
import { useParams } from 'react-router-dom'

// Error Handler
import errorHandler from '../../../helpers/errorHandler.js'

const DetailPlotingComp = (props) => {

	const currentUrl = window.location.pathname.split("/");
	const segment_1 = currentUrl[1];

	const params = useParams()
	const [plot, setPlot] = useState('')

	const fetchData = async () => {
		// alert(params.id)
		try {
			const options = {
				url: `/plots/${params.id}`,
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					appApiName: `scheduleSystem`,
					modApiName: `${segment_1}`,
					policy: `read`
				}
			}
			const { data } = await axios(options)
			// console.log(data.data)
			setPlot(data.data)

		} catch (err) {
			errorHandler({ err: err?.response?.data || err })
		}
	}

	useEffect(() => {
		fetchData()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// console.log(plot)

	return (
		<>
			{
				plot !== '' ?
					<>
						<div className="row mb-3">
							<div className="col-12">
								<dl className="row">
									<dt className="col-3">Plott Id</dt>
									<dd className="col-9">: {plot.id}</dd>

									<dt className="col-3">WBS</dt>
									<dd className="col-9">: {plot.wbs}</dd>

									<dt className="col-3">Opportunity Id</dt>
									<dd className="col-9">: {plot.OpportunityId}</dd>

									<dt className="col-3">Client</dt>
									<dd className="col-9">: {plot.client}</dd>

									<dt className="col-3">Topic</dt>
									<dd className="col-9">: {plot.topic}</dd>

									<dt className="col-3">APM Group</dt>
									<dd className="col-9">: {plot.group}</dd>
								</dl>
							</div>
						</div>
						<h3><Badge bg="success" style={{ fontWeight: '600' }}>List of Schedule</Badge></h3>
						<div className="row mb-3">
							<div className="table-responsive">
								<table className="table table-vcenter table-wrap">
									<thead>
										<tr>
											<th>#</th>
											<th>Schedule Id</th>
											<th>Activities</th>
											<th>Class Type</th>
											<th>Consultants</th>
											<th>Location</th>
											<th>Gcal Sync Status</th>
											<th>Date</th>
											<th>Time</th>
											<th>Notes</th>
										</tr>
									</thead>
									<tbody>
										{
											plot.Schedules.map((item, idx) => (
												<tr>
													<td>{idx + 1}</td>
													<td>{item.id}</td>
													<td>{item.ActivityType.label}</td>
													<td>{item.ClassType.label}</td>
													<td>
														<ul>
															{
																item.Consultants.map((rc, i) =>
																	<li key={i}>
																		{rc.alias}
																	</li>
																)
															}
														</ul>
													</td>
													<td>{item.location}</td>
													<td>
														{item.gcalEventStatus === "OK" ? "SYNC" : "NOT SYNC"}
													</td>
													<td>{numberToDate(item.date)}</td>
													<td>
														{numberToTime(item.startHours)} - {numberToTime(item.endHours)}
													</td>
													<td>{item.description}</td>
												</tr>
											))
										}
									</tbody>
								</table>
							</div>
						</div>
						<h3><Badge bg="danger" style={{ fontWeight: '600' }}>Plott Permissions</Badge></h3>
						<div className="row mb-3">
							<div className="table-responsive">
								<table className="table table-vcenter table-wrap">
									<thead>
										<tr>
											<th>#</th>
											<th>User Id</th>
											<th>Created By</th>
											<th>Email</th>
										</tr>
									</thead>
									<tbody>
										{
											plot.PlotPermissions.map((item, idx) => (
												<tr>
													<td>{idx + 1}</td>
													<td>{item.id}</td>
													<td>{item.name}</td>
													<td>{item.email}</td>
												</tr>
											))
										}
									</tbody>
								</table>
							</div>
						</div>
					</>
					:
					<div className='d-flex justify-content-center'>
						<p>Please wait a moment <Spinner animation="grow" variant="primary" size="sm" /> <Spinner animation="grow" variant="success" size="sm" /> <Spinner animation="grow" size="sm" /></p>
					</div>
			}
		</>
	)
}

export default DetailPlotingComp
