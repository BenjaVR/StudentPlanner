import * as React from "react";
import { RouteComponentProps } from "react-router";
import { IWithAuthenticationState } from "../components/HOC/withAuthentication";
import { LogInPage } from "../pages/LogInPage";
import { SchoolsPage } from "../pages/SchoolsPage";
import { SignUpPage } from "../pages/SignUpPage";

export type RoutePageComponentProps = RouteComponentProps<any> & IWithAuthenticationState;

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

const signUpRoute: IRoute = {
    title: "Sign Up",
    url: "/signup",
    component: SignUpPage,
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
    signUpRoute,
    schoolsRoute,
    studentsRoute,
};
