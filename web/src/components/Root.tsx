import React from "react";
import Helmet from "react-helmet";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { routes } from "../routes";
import AuthChecker from "./auth/AuthChecker";

const Root: React.FunctionComponent = () => (
    <React.Fragment>
        <Helmet titleTemplate="%s | Student Planner" defaultTitle="Student Planner" />
        <AuthChecker>
            <BrowserRouter>
                <Switch>
                    <Route exact={true} path={routes.logInRoute.url} component={routes.logInRoute.component} />
                    <Route exact={true} path={routes.schoolsRoute.url} component={routes.schoolsRoute.component} />
                    <Route exact={true} path={routes.studentsRoute.url} component={routes.studentsRoute.component} />

                    <Redirect to={routes.logInRoute.url} />
                </Switch>
            </BrowserRouter>
        </AuthChecker>
    </React.Fragment>
);

export default Root;