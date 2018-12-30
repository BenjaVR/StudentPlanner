import React from "react";
import Helmet from "react-helmet";
import { BrowserRouter, Redirect, Switch } from "react-router-dom";
import { routes } from "../routes";
import AuthChecker from "./auth/AuthChecker";
import NotAuthenticatedOnlyRoute from "./routes/NotAuthenticatedOnlyRoute";
import PrivateRoute from "./routes/PrivateRoute";

const Root: React.FunctionComponent = () => (
    <React.Fragment>
        <Helmet titleTemplate="%s | Student Planner" defaultTitle="Student Planner" />
        <AuthChecker>
            <BrowserRouter>
                <Switch>
                    <NotAuthenticatedOnlyRoute exact={true} path={routes.logInRoute.url} component={routes.logInRoute.component} />
                    <PrivateRoute exact={true} path={routes.planningsRoute.url} component={routes.planningsRoute.component} />
                    <PrivateRoute exact={true} path={routes.studentsRoute.url} component={routes.studentsRoute.component} />
                    <PrivateRoute exact={true} path={routes.schoolsRoute.url} component={routes.schoolsRoute.component} />
                    <PrivateRoute exact={true} path={routes.departmentsRoute.url} component={routes.departmentsRoute.component} />

                    <Redirect to={routes.logInRoute.url} />
                </Switch>
            </BrowserRouter>
        </AuthChecker>
    </React.Fragment>
);

export default Root;
