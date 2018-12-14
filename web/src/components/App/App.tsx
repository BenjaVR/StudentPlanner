import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { IRoute, routes } from "../../routes";
import withAuthentication from "../HOC/withAuthentication";
import LoginForm from "../LoginForm";

interface IMenuItem {
    route: IRoute;
    iconType: string;
}

interface IAppProps {
}

interface IAppState {
    siderCollapsed: boolean;
    siderWidth: number;
    selectedMenuItem: IMenuItem;
}

class App extends React.Component<IAppProps, IAppState> {

    public render(): React.ReactNode {
        return (
            <LoginForm />
            // <BrowserRouter>
            //     <Switch>
            //         <Route exact={true} path={routes.logInRoute.url} component={routes.logInRoute.component}/>
            //         <Route exact={true} path={routes.signUpRoute.url} component={routes.signUpRoute.component}/>
            //
            //         <Route/>
            //         <Route
            //             exact={true}
            //             path={routes.schoolsRoute.url}
            //             component={withAuthentication(routes.schoolsRoute.component)}
            //         />
            //         <Route
            //             exact={true}
            //             path={routes.studentsRoute.url}
            //             component={withAuthentication(routes.studentsRoute.component)}
            //         />
            //
            //         {/*TODO: not found*/}
            //         <Route component={LoginForm}/>
            //     </Switch>
            // </BrowserRouter>
        );
    }
}

export default App;
