import React from 'react'
import { numberToDate } from '../../../helpers/numberToDate'
import { arrayToString } from '../../../helpers/arrayToString'
import { numberToTime } from '../../../helpers/numberToTime'
import { nameOfDay } from '../../../helpers/nameOfDay'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'

const PlottingViewComp = (props) => {
	console.log(props)
	const history = useHistory()
	const handleChangePage = path => {
		history.push(path)
	}

	return (
		<div>
			<div className="row mb-3 card">
				<div className="table-responsive">
					<table className="table table-vcenter table-wrap table-bordered">
						<thead>
							<tr>
								<th>#</th>
								<th>Nama Klien</th>
								<th>Nama Program</th>
								<th>PIC APM</th>
								<th>WBS Lv 2</th>
								<th>Activity</th>
								<th>Tanggal Pelaksanaan</th>
								<th>Hari</th>
								<th>Jam</th>
								<th>RC/AC/RA/AA</th>
								<th>Lokasi</th>
								<th>Aksi</th>
							</tr>
						</thead>
						<tbody>
							{
								props.schedules.map((item, idx) => (
									<>
										<tr key={idx} rowspan="3">
											<td>{idx + 1}</td>
											<td>{item.client}</td>
											<td>{item.topic}</td>
											<td>{item.group}</td>
											<td>{item.wbs}</td>
											<td>
												{
													item.Schedules.map((row, idx) => (
														<>
															<tr>
																<td>{row.ActivityType.label}</td>
															</tr>
															<hr style={{ margin: '1px' }}></hr>
														</>
													))
												}
											</td>
											<td>
												{
													item.Schedules.map((row, idx) => (
														<>
															<tr>
																<td>{numberToDate(row.date)}</td>
															</tr>
															<hr style={{ margin: '1px' }}></hr>
														</>
													))
												}
											</td>
											<td>
												{
													item.Schedules.map((row, idx) => (
														<>
															<tr>
																<td>{nameOfDay(row.date)}</td>
															</tr>
															<hr style={{ margin: '1px' }}></hr>
														</>
													))
												}
											</td>
											<td>
												{
													item.Schedules.map((row, idx) => (
														<>
															<tr>
																<td>
																	{numberToTime(row.startHours)}
																	&nbsp;-&nbsp;
																	{numberToTime(row.endHours)}
																</td>
															</tr>
															<hr style={{ margin: '1px' }}></hr>
														</>
													))
												}
											</td>
											<td>
												{
													item.Schedules.map((row, idx) => (
														<>
															<tr>
																<td>
																	{
																		arrayToString(row.Consultants)
																	}
																</td>
															</tr>
															<hr style={{ margin: '1px' }}></hr>
														</>
													))
												}
											</td>
											<td>
												{
													item.Schedules.map((row, idx) => (
														<>
															<tr>
																<td>{row.location}</td>
															</tr>
															<hr style={{ margin: '1px' }}></hr>
														</>
													))
												}
											</td>
											<td>
												{
													item.Schedules.map((row, idx) => (
														<>
															<tr>
																<td>
																	<button type='button' className='btn btn-sm btn-ghost-warning'>
																		<Link
																			style={{ color: 'black' }}
																			to={`/program-charter/${row.id}`}
																			target="_blank"
																		>
																			Program Charter
																		</Link>
																	</button>
																</td>
															</tr>
															<hr style={{ margin: '1px' }}></hr>
														</>
													))
												}
											</td>
										</tr>
									</>
								))
							}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default PlottingViewComp
