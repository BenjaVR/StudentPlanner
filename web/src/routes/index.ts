import * as React from "react";
import { RouteComponentProps } from "react-router";
import { LoginPage } from "../components/auth/LoginPage";
import SchoolsPage from "../components/schools/SchoolsPage";

export type RoutePageComponentProps = RouteComponentProps<any>;

export interface IRoute {
    title: string;
    url: string;
    component: React.ComponentType<RoutePageComponentProps>;
}

const logInRoute: IRoute = {
    title: "Log In",
    url: "/login",
    component: LoginPage,
};

const schoolsRoute: IRoute = {
    title: "Scholen",
    url: "/schools",
    component: SchoolsPage,
};

const studentsRoute: IRoute = {
    title: "Studenten",
    url: "/students",
    component: SchoolsPage,
};

export const routes = {
    logInRoute,
    schoolsRoute,
    studentsRoute,
};
