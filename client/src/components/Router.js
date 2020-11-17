import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";

import Home from "./Home";
import File from "./File";

const Router = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/file/:path" component={File} />
			</Switch>
		</BrowserRouter>
	);
};

export default Router;
