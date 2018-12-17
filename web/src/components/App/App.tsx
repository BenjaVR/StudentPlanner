import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { routes } from "../../routes";
import { AuthChecker } from "../auth/AuthChecker";
import { LoginForm } from "../auth/LoginForm";

interface IAppProps {
}

interface IAppState {
}

class App extends React.Component<IAppProps, IAppState> {

    public render(): React.ReactNode {
        return (
            <AuthChecker>
                <BrowserRouter>
                    <Switch>
                        <Route exact={true} path={routes.logInRoute.url} component={routes.logInRoute.component}/>
                        <Route exact={true} path={routes.schoolsRoute.url} component={routes.schoolsRoute.component}/>
                        <Route exact={true} path={routes.studentsRoute.url} component={routes.studentsRoute.component}/>
                        <Route component={LoginForm}/>
                    </Switch>
                </BrowserRouter>
            </AuthChecker>
        );
    }
}

export default App;
