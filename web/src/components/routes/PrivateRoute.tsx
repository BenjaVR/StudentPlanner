import React from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { Firebase } from "../../config/FirebaseInitializer";
import { routes } from "../../routes";

const PrivateRoute: React.FunctionComponent<RouteProps> = (props: RouteProps) => {
    return Firebase.auth().currentUser === null
        ? <Redirect to={routes.logInRoute.url} />
        : <Route {...props} />;
};

export default PrivateRoute;
