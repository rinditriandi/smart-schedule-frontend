import React from 'react'
import { numberToDate } from '../../../helpers/numberToDate.js'
import { numberToTime } from '../../../helpers/numberToTime.js'
import Badge from 'react-bootstrap/Badge';
import { convertMsToMinute } from '../../../helpers/convertMsToMinute.js';

// Hooks
import { useExportExcelSummaryCogs } from '../../../hooks';

// Axios
import axios from '../../../lib/axios-ss.js'

// Error Handler
import errorHandler from '../../../helpers/errorHandler.js';

const TableLearningHours = ({ consultant, dateFrom, dateTo, report, activity, classType, fetchLearningHours }) => {

	const { setExecuteExportExcel, setLoadingExportExcel } = useExportExcelSummaryCogs({ consultant, dateFrom, dateTo, classType, activity })

	const handleRefreshWbs = async (id) => {
		try {
			const currentUrl = window.location.pathname.split("/");
			const segment_1 = currentUrl[1];

			await axios({
				url: `/plots/refresh/${id}`,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					appApiName: `scheduleSystem`,
					modApiName: `${segment_1}`,
					policy: `read`
				}
			})

			fetchLearningHours(true)
		} catch (err) {
			errorHandler({ err: err?.response?.data || err })
		}
	}

	return (
		<>
			{
				report.length !== 0 ?
					<>
						<div className="row mb-3">
							<div className='col-6'>
								<table className="table table-vcenter table-wrap">
									<thead>
										<tr>
											<th>Date From</th>
											<th> : </th>
											<th>{dateFrom}</th>
										</tr>
										<tr>
											<th>Date To</th>
											<th> : </th>
											<th>{dateTo}</th>
										</tr>
										<tr>
											<th>Learning Hours</th>
											<th> : </th>
											<th>{report?.learningHours?.inText}</th>
										</tr>
									</thead>

								</table>
							</div>
							<div className='col text-end'>
								<button
									className='btn btn-success'
									type='button'
									onClick={() => setExecuteExportExcel(true)}
								>
									Export Excel
								</button>
							</div>
						</div>
						<div className="row mb-3">
							<div className="table-responsive">
								<table className="table table-vcenter table-wrap">
									<thead>
										<tr>
											<th>#</th>
											<th>Teaching Date</th>
											<th>Start Hours</th>
											<th>End Hours</th>
											<th>Break Duration (Minute)</th>
											<th>Topic</th>
											<th>Company</th>
											<th>WBS Code</th>
											<th>Profit Center</th>
											<th>Program Category</th>
											<th>SAP Project ID</th>
											<th>APM</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{
											report.schedules.map((item, idx) => (
												<tr key={idx}>
													<td>{idx + 1}</td>
													<td>{numberToDate(item.date)}</td>
													<td>{numberToTime(item.startHours)}</td>
													<td>{numberToTime(item.endHours)}</td>
													<td>{convertMsToMinute(item.breakDuration)}</td>
													<td>{item.Plot.topic}</td>
													<td>{item.Plot.client}</td>
													<td>{item.Plot.wbs}</td>
													<td>{item.Plot.profitCenter}</td>
													<td>{item.Plot.programCategory}</td>
													<td>{item?.Plot?.PlotSapProjectId?.sapProjectId || '-'}</td>
													<td>{item.Plot.group}</td>
													<td>
														<button
															type="button"
															className='btn btn-sm btn-primary'
															onClick={() => handleRefreshWbs(item.Plot.id)}
														>
															Refresh
														</button>
													</td>
												</tr>
											))
										}
									</tbody>
								</table>
							</div>
						</div>
					</>
					:
					<div className='row'>
						<div className='col-12 text-center'>
							<Badge bg="danger">
								Please select Consultant for Learning Hours.
							</Badge>
						</div>
					</div>
			}
		</>
	)
}

export default TableLearningHours
