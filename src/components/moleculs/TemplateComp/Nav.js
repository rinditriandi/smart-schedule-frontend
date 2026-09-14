import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { logo } from '../../../assets'
import axios from '../../../lib/axios'
import { MySwal } from '../../../lib/swal'

function Nav() {

	const history = useHistory()

	const [dataMasterModules, setdataMasterModules] = useState([])
	const [dataTrxModules, setdataTrxModules] = useState([])
	const [reportModules, setReportModules] = useState([])

	const fetchData = async () => {
		try {
			const options = {
				url: '/modules/byToken',
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					appApiName: `scheduleSystem`
				}
			}
			const { data } = await axios(options)
			for (let i = 0; i < data.data.length; i++) {
				if (
					data.data[i].label === 'Consultant Types' || data.data[i].label === 'Consultants' ||
					data.data[i].label === 'Support Types' || data.data[i].label === 'Supports'
				) {
					setdataMasterModules(dataTrxModules => [...dataTrxModules, {
						'label': data.data[i].label,
						'apiName': data.data[i].apiName
					}])
				} else if (
					data.data[i].label === 'WBS' ||
					data.data[i].label === 'Schedule' || data.data[i].label === 'Time Off'
				) {
					setdataTrxModules(dataTrxModules => [...dataTrxModules, {
						'label': data.data[i].label,
						'apiName': data.data[i].apiName
					}])
				}
			}
			for (let i = 0; i < data.data.length; i++) {
				if (
					data.data[i].label === 'Consultant Types' || data.data[i].label === 'Consultants' ||
					data.data[i].label === 'Support Types' || data.data[i].label === 'Supports'
				) {
					setdataMasterModules(dataTrxModules => [...dataTrxModules, {
						'label': data.data[i].label,
						'apiName': data.data[i].apiName
					}])
				} else if (data.data[i].label === 'Learning Hours for APM' || data.data[i].label === 'Sum of Learning Hours by APM' || data.data[i].label === 'Learning Hours for PNC' || data.data[i].label === 'Sum of Learning Hours by Profit Center' || data.data[i].label === 'Learning Hours All Consultants' || data.data[i].label === 'Learning Hours' || data.data[i].label === 'Summary COGS' || data.data[i].label === 'Summary WBS' || data.data[i].apiName === 'class-types-percentage' || data.data[i].apiName === 'class-types-percentage-by-profit-center') {
					setReportModules(dataTrxModules => [...dataTrxModules, {
						'label': data.data[i].label,
						'apiName': data.data[i].apiName
					}])
				}
			}

		} catch (err) {
			if (err) {
				console.log(err?.response?.data)
				if (err?.response?.data?.status === 401) {
					MySwal.fire({
						icon: 'error',
						title: 'Ooops, Error!',
						text: 'Unauthorized',
					})
					setTimeout(() => {
						localStorage.clear()
						window.location.reload()
					}, 3000);
				} else if (err?.response?.data?.status === 403) {
					setTimeout(() => {
						MySwal.fire({
							icon: 'info',
							title: 'Oops, You have no acceess!',
							text: 'For this page, Please contact IT ELI.',
						})
					}, 2000);
					setTimeout(() => {
						window.location.href = '/home'
					}, 4000);
				}
			}
		}
	}

	const handleChangePage = (path) => {
		// console.log(path)
		if (path === '/login') {
			localStorage.clear()
			window.location.href = "https://my.prasmul-eli.co/login"
		} else {
			history.push(path)
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	// console.log(dataMasterModules)

	return (
		<div>
			<div>
				<header className="navbar navbar-expand-md d-print-none" style={{ backgroundColor: '#26D07C' }}>
					<div className="container-xl">
						<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
							<span className="navbar-toggler-icon" />
						</button>
						<h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3" style={{ color: '#FFFFFF' }}>
							Schedule System
						</h1>
						<div className="navbar-nav flex-row order-md-last">

							<div className="nav-item dropdown">
								<span className="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown" aria-label="Open user menu">
									<span className="avatar avatar-sm" style={{ backgroundImage: 'url(avatar-default.jpeg)' }} />
									<div className="d-none d-xl-block ps-2">
										<div style={{ color: '#FFFFFF' }}>{localStorage.getItem('fullname')}</div>
										<div className="mt-1 small" style={{ color: '#FFFFFF' }}>{localStorage.getItem('email')}</div>
									</div>
								</span>
								<div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
									{/* <a href="#" className="dropdown-item">Reset Password</a> */}
									<span onClick={() => handleChangePage('/login')} className="dropdown-item">Logout from Schedule System</span>
								</div>
							</div>
						</div>
					</div>
				</header>
				<div className="navbar-expand-md">
					<div className="collapse navbar-collapse" id="navbar-menu">
						<div className="navbar navbar-light">
							<div className="container-xl">
								<ul className="navbar-nav">
									<li className="nav-item">
										<div className="nav-link">
											<img src={logo} width={110} height={32} alt="Tabler" className="navbar-brand-image" />
										</div>
									</li>
									<li className='nav-item'>
										<div className="nav-link" type="button" onClick={() => handleChangePage('/home')}>
											<span className="nav-link-title">
												Home
											</span>
										</div>
									</li>
									<li className='nav-item dropdown'>
										<a className="nav-link dropdown-toggle" href="#navbar-extra" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false">
											<span className="nav-link-title">
												Data Transactions
											</span>
										</a>
										<div className="dropdown-menu">
											{
												dataTrxModules.map((row, i) =>
													<li key={i} className="dropdown-item" onClick={() => handleChangePage(`/${row.apiName}`)}>
														{row.label}
													</li>
												)
											}

										</div>
									</li>
									<li className='nav-item dropdown'>
										<a className="nav-link dropdown-toggle" href="#navbar-extra" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false">
											<span className="nav-link-title">
												Reports
											</span>
										</a>
										<div className="dropdown-menu">
											{
												reportModules.map((row, i) =>
													<li key={i} className="dropdown-item" onClick={() => handleChangePage(`/${row.apiName}`)}>
														{row.label}
													</li>
												)
											}

										</div>
									</li>

								</ul>
								<div className="my-2 my-md-0 flex-grow-1 flex-md-grow-0 order-first order-md-last">
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div >
	)
}

export default Nav
