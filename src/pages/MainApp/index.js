import React from "react";
import { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { MySwal } from "../../lib/swal";

import {
	Nav
} from "../../components";

import Home from "../Home";
import Auth from "../Auth";
import Schedules from "../Schedules";
import Ploting from "../Ploting";
import PlotingDetail from "../Ploting/PlotingDetail";
import ScheduleDetail from "../Schedules/ScheduleDetail";
import ProgramCharter from "../ProgramCharter";
import CogsPage from "../Cogs";
import SummaryWbsPage from "../SummaryWbs";
import LearningHoursByConsultantPage from "../LearningHoursByConsultant";
import LearningHoursByApmPage from "../LearningHoursByApm";
import LearningHoursByProfitCenterPage from "../LearningHoursByProfitCenter";
import LearningHoursForApm from "../LearningHoursForApm";
import LearningHoursForApmCopy from "../LearningHoursForApmCopy";
import ClassTypesPercentage from "../ClassTypesPercentage";
import Timeoff from "../Schedules/Timeoff";
import ClassTypesPercentageByProfitCenter from "../ClassTypesPercentageByProfitCenter";

const MainApp = () => {

	const currentUrl = window.location.pathname.split("/");
	const segment_1 = currentUrl[1];

	// jika akses token tidak ada redirect ke login
	if (!localStorage.getItem('token') && segment_1 !== "auth") {
		MySwal.fire({
			icon: 'error',
			title: 'Ooops, Error!',
			text: 'Unauthorized',
		})
		setTimeout(() => {
			localStorage.clear()
			window.location.href = "https://my.prasmul-eli.co/login"
		}, 3000);
	}

	return (
		<div className="page">
			<Router>
				<Switch>
					<Route exact path="/auth/:token">
						<Auth />
					</Route>
					<Fragment>
						<Nav />
						<Route exact path="/home">
							<Home />
						</Route>
						<Route exact path="/plotting">
							<Ploting />
						</Route>
						<Route exact path="/plotting-detail/:id">
							<PlotingDetail />
						</Route>
						<Route exact path="/list-of-schedule">
							<Schedules />
						</Route>
						<Route exact path="/schedule-detail/:id">
							<ScheduleDetail />
						</Route>
						<Route exact path="/program-charter/:scheduleId">
							<ProgramCharter />
						</Route>
						<Route exact path="/summary-cogs">
							<CogsPage />
						</Route>
						<Route exact path="/summary-wbs">
							<SummaryWbsPage />
						</Route>
						<Route exact path="/learning-hours-all-consultants">
							<LearningHoursByConsultantPage />
						</Route>
						<Route exact path="/learning-hours-for-apm">
							<LearningHoursForApm />
						</Route>
						<Route exact path="/class-types-percentage">
							<ClassTypesPercentage />
						</Route>
						<Route exact path="/class-types-percentage-by-profit-center">
							<ClassTypesPercentageByProfitCenter />
						</Route>
						<Route exact path="/learning-hours">
							<LearningHoursForApmCopy />
						</Route>
						<Route exact path="/sum-of-learning-hours-by-apm">
							<LearningHoursByApmPage />
						</Route>
						<Route exact path="/sum-of-learning-hours-by-profit-center">
							<LearningHoursByProfitCenterPage />
						</Route>
						<Route exact path="/time-off">
							<Timeoff />
						</Route>
						<Route exact path="/consultant-types">
							<h1 className="text-center my-3">Maaf fitur ini belum berfungsi</h1>
						</Route>
						<Route exact path="/consultants">
							<h1 className="text-center my-3">Maaf fitur ini belum berfungsi</h1>
						</Route>
						<Route exact path="/support-types">
							<h1 className="text-center my-3">Maaf fitur ini belum berfungsi</h1>
						</Route>
						<Route exact path="/support">
							<h1 className="text-center my-3">Maaf fitur ini belum berfungsi</h1>
						</Route>
						<Route exact path="/check-schedule">
							<h1 className="text-center my-3">Maaf fitur ini belum berfungsi</h1>
						</Route>
						<Route exact path="/schedule-deleted">
							<h1 className="text-center my-3">Maaf fitur ini belum berfungsi</h1>
						</Route>
						<Route exact path="/schedule-updated">
							<h1 className="text-center my-3">Maaf fitur ini belum berfungsi</h1>
						</Route>
						<Route exact path="/">
							<Home />
						</Route>
					</Fragment>
				</Switch>
			</Router>
		</div>
	);
};

export default MainApp;
