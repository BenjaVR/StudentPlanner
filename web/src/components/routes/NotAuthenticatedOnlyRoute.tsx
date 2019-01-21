import React from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { routes } from "../../routes";
import { Firebase } from "../../services/FirebaseInitializer";

const NotAuthenticatedOnlyRoute: React.FunctionComponent<RouteProps> = (props: RouteProps) => {
    return Firebase.auth().currentUser === null
        ? <Route {...props} />
        : <Redirect to={routes.signedInHomeRoute.url} />;
};

export default NotAuthenticatedOnlyRoute;
