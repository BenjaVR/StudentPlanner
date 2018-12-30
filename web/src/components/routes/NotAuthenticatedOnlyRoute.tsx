import React from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { Firebase } from "../../config/FirebaseInitializer";
import { routes } from "../../routes";

const NotAuthenticatedOnlyRoute: React.FunctionComponent<RouteProps> = (props: RouteProps) => {
    return Firebase.auth().currentUser === null
        ? <Route {...props} />
        : <Redirect to={routes.schoolsRoute.url} />;
};

export default NotAuthenticatedOnlyRoute;
