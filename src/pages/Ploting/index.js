import React, { useState, useEffect } from 'react'
import { MySwal } from '../../lib/swal.js'
import axios from '../../lib/axios-ss.js'
import { AddPlottingComp, DataTablePloting, UpdatePlottingComp, Loading } from '../../components';
import { Modal } from 'react-bootstrap'
import loadingImg from '../../assets/images/loading.gif'
import queryParams from '../../helpers/queryParams.js';
import { convertMsToHour } from '../../helpers/convertMsToHour.js';

// Router
import { useHistory, useLocation } from "react-router-dom"

// Error Handler
import errorHandler from '../../helpers/errorHandler.js';

// Hooks
import { useFetchPlots, useRefreshPlot } from '../../hooks'

const Ploting = () => {
	const history = useHistory()
	const location = useLocation()
	const page = queryParams({ path: location.search, key: 'page' })

	const currentUrl = window.location.pathname.split("/");
	const segment_1 = currentUrl[1];

	const { plots, loadingFetchPlots, executeFetchPlots, setSearchPlots, searchPlots, totalItemsPlot, totalPagesPlot } = useFetchPlots()
	const { executeRefreshPlot, loadingRefreshPlot } = useRefreshPlot({ fetchPlots: executeFetchPlots })
	const [plottId, setPlottId] = useState('')
	const [loading, setLoading] = useState(false)

	const [lgShowAdd, setLgShowAdd] = useState(false)
	const [lgShowUpdate, setLgShowUpdate] = useState(false)

	const handleModalUpdate = (id) => {
		setPlottId(id)
		setLgShowUpdate(true)
	}

	useEffect(() => {
		if (!page) {
			history.push(`${location.pathname}?page=1`)
		}
	}, [])

	return (
		<>
			{(loadingFetchPlots || loadingRefreshPlot) && <Loading />}
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
									Odoo Projects
								</h2>
							</div>
							{/* Page title actions */}
							<div className="col-auto ms-auto d-print-none">
								<div className="btn-list">
									{/* button action list */}
									<button style={{ fontWeight: '550' }} onClick={() => setLgShowAdd(true)} className="btn btn-success">
										Create Project
									</button>
								</div>
							</div>
						</div>
					</div>
					{
						loading ?
							<div style={{ textAlign: 'center' }}>
								<img
									alt='loading'
									src={loadingImg}
									style={{ width: '150px' }}
								/>
							</div>
							:
							null
					}
					<div className="row row-deck row-cards">
						<div className="card card-md" style={{ overflowX: 'scroll' }}>
							<div className="card-body">
								<div className='row mb-3'>
									<div className='col-lg-3 col-md-3'>
										<input
											type='text'
											placeholder='search'
											className='form-control'
											value={searchPlots}
											onChange={e => setSearchPlots(e.target.value)}
										/>
									</div>
								</div>
								<div className='row'>
									<table className='table table-sm table-hover' style={{ fontSize: '10px' }}>
										<thead>
											<tr>
												<th>Actions</th>
												<th>WBS Name</th>
												<th>Odoo Project ID</th>
												{/* <th>Opportunity ID</th> */}
												{/* <th>WBS Element Lv 2</th> */}
												<th>Topic</th>
												<th>Client</th>
												<th>APM</th>
												{/* <th>Profit Center</th> */}
												<th>WBS Period</th>
												{/* <th>SAP ID</th> */}
												<th>Sales</th>
												<th>Plan Hours</th>
												<th>Created At</th>
											</tr>
										</thead>
										<tbody>
											{
												plots.map(plotItem => (
													<tr key={plotItem.id}>
														<td>
															<button
																type="button"
																className='btn btn-sm btn-secondary mx-1'
																onClick={() => executeRefreshPlot(plotItem.id)}
															>
																Refresh
															</button>
															<button
																type="button"
																className='btn btn-sm btn-primary mx-1'
																onClick={() => handleModalUpdate(plotItem.id)}
															>
																Edit
															</button>
														</td>
														<td>{plotItem.name}</td>
														<td>{plotItem.odooWbsId}</td>
														{/* <td>{plotItem.OpportunityId}</td> */}
														{/* <td>{plotItem.wbs}</td> */}
														<td>{plotItem.topic}</td>
														<td>{plotItem.client}</td>
														<td>{plotItem.group}</td>
														{/* <td>{plotItem?.profitCenter || '-'}</td> */}
														<td>{plotItem?.wbsPeriod ? new Intl.DateTimeFormat('id', { dateStyle: 'medium', timeZone: 'Asia/Jakarta' }).format(new Date(plotItem.wbsPeriod)) : '-'}</td>
														{/* <td>{plotItem?.sapId || '-'}</td> */}
														<td>{new Intl.NumberFormat('id', { style: 'currency', currency: 'IDR' }).format(plotItem?.sales || 0)}</td>
														<td>{plotItem?.planHours ? `${convertMsToHour(plotItem.planHours)} Hour` : '-'}</td>
														<td>{new Intl.DateTimeFormat('id', { dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Asia/Jakarta' }).format(new Date(plotItem.createdAt))}</td>
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
									<span>{page}</span>
									<button
										className='btn btn-sm btn-secondary mx-2'
										type="button"
										onClick={() => {
											if (Number(page) != totalPagesPlot) {
												history.push(`${location.pathname}?page=${(Number(page) + 1)}`)
											}
										}}
										disabled={Number(page == totalPagesPlot)}
									>
										Next
									</button>
								</div>
								<div className='mt-2 mx-2'>Total Data: {totalItemsPlot}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Modal
				size="lg"
				show={lgShowAdd}
				onHide={() => setLgShowAdd(false)}
				aria-labelledby="example-modal-sizes-title-sm"
			>
				<Modal.Header closeButton>
					<Modal.Title id="example-modal-sizes-title-sm">Create WBS</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{/* konten detail */}
					<AddPlottingComp
						close={() => setLgShowAdd(false)}
						fetch={executeFetchPlots}
					/>

				</Modal.Body>
			</Modal>

			<Modal
				size="lg"
				show={lgShowUpdate}
				onHide={() => setLgShowUpdate(false)}
				aria-labelledby="example-modal-sizes-title-sm"
			>
				<Modal.Header closeButton>
					<Modal.Title id="example-modal-sizes-title-sm">Update WBS</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{/* konten detail */}
					<UpdatePlottingComp
						close={() => setLgShowUpdate(false)}
						fetch={executeFetchPlots}
						plottId={plottId}
					/>

				</Modal.Body>
			</Modal>
		</>
	)
}

export default Ploting
