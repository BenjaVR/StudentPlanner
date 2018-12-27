import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { routes } from "../../routes";
import AuthChecker from "../auth/AuthChecker";

const App: React.FunctionComponent = () => (
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
);

export default App;
