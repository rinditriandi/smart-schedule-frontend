import React from 'react'
import schedulePng from '../../assets/images/schedule.png'

const Home = () => {

	return (
		<div>
			<div className="content">
				<div className="container-xl">
					{/* Page title */}
					<div className="page-header d-print-none">
						<div className="row align-items-center">
							<div className="col">
								{/* Page pre-title */}
								<div className="page-pretitle">
									Login as, {localStorage.getItem('fullname')}
								</div>
							</div>
							{/* Page title actions */}
							<div className="col-auto ms-auto d-print-none">
								<div className="btn-list">
									{/* button action list */}
								</div>
							</div>
						</div>
					</div>
					<div style={{ marginTop: '-40px' }} className="row d-flex justify-content-center">
						<img
							alt='schedule'
							src={schedulePng}
							style={{ width: '40%' }}
						/>
						<h1 style={{ marginTop: '-70px' }} className='text-center'>Welcome to Schedule System</h1>
						<h1 style={{ marginTop: '-30px' }} className='text-center'>prasmul-eli</h1>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Home
