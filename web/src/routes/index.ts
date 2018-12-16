import * as React from "react";
import { RouteComponentProps } from "react-router";
import { LogInPage } from "../components/auth/LogInPage";
import { SchoolsPage } from "../pages/SchoolsPage";

export type RoutePageComponentProps = RouteComponentProps<any>;

export interface IRoute {
    title: string;
    url: string;
    component: React.ComponentType<RoutePageComponentProps>;
}

// TODO: titles localizable!

const logInRoute: IRoute = {
    title: "Log In",
    url: "/login",
    component: LogInPage,
};

const schoolsRoute: IRoute = {
    title: "Schools",
    url: "/schools",
    component: SchoolsPage,
};

const studentsRoute: IRoute = {
    title: "Students",
    url: "/students",
    component: SchoolsPage,
};

export const routes = {
    logInRoute,
    schoolsRoute,
    studentsRoute,
};
