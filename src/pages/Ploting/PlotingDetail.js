import React from 'react'
import { DetailPlotingComp } from '../../components'
import { useHistory } from 'react-router-dom'

const PlotingDetail = () => {

	const history = useHistory()
	const handleChangePage = path => {
		history.push(path)
	}

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
									Plotting Detail
								</h2>
							</div>
							{/* Page title actions */}
							<div className="col-auto ms-auto d-print-none">
								<div className="btn-list">
									{/* button action list */}
									<button style={{ fontWeight: '550' }} className="btn btn-warning" onClick={() => handleChangePage(`/plotting`)}> Back to Plotting
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="row row-deck row-cards">
						<div className="card card-md">
							<div className="card-body">
								<div className='row'>
									<DetailPlotingComp />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default PlotingDetail
