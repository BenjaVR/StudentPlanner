import * as React from "react";
import { RouteComponentProps } from "react-router";
import LoginPage from "./components/auth/login/LoginPage";
import SchoolsPage from "./components/schools/SchoolsPage";

export type RoutePageComponentProps = RouteComponentProps<any>;

export interface IRoute {
    title: string;
    url: string;
    component: React.ComponentType<RoutePageComponentProps>;
}

const logInRoute: IRoute = {
    title: "Login",
    url: "/login",
    component: LoginPage,
};

const planningsRoute: IRoute = {
    title: "Planning",
    url: "/planning",
    component: SchoolsPage,
};

const studentsRoute: IRoute = {
    title: "Studenten",
    url: "/students",
    component: SchoolsPage,
};

const schoolsRoute: IRoute = {
    title: "Scholen",
    url: "/schools",
    component: SchoolsPage,
};

const departmentsRoute: IRoute = {
    title: "Afdelingen",
    url: "/departments",
    component: SchoolsPage,
};

export const routes = {
    signedInHomeRoute: studentsRoute,
    signedOutHomeRoute: logInRoute,

    logInRoute,
    planningsRoute,
    studentsRoute,
    schoolsRoute,
    departmentsRoute,
};