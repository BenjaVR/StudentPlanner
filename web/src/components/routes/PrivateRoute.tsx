import React from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { routes } from "../../routes";
import { Firebase } from "../../services/FirebaseInitializer";

const PrivateRoute: React.FunctionComponent<RouteProps> = (props: RouteProps) => {
    return Firebase.auth().currentUser === null
        ? <Redirect to={routes.logInRoute.url} />
        : <Route {...props} />;
};

export default PrivateRoute;
