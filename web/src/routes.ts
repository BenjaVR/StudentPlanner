import * as React from "react";
import { RouteComponentProps } from "react-router";
import LoginPage from "./components/auth/login/LoginPage";
import AppContainer from "./components/containers/AppContainer";
import DepartmentsPage from "./components/departments/DepartmentsPage";
import EducationsPage from "./components/educations/EducationsPage";
import PlanningsPage from "./components/planning/PlanningsPage";
import SchoolsPage from "./components/schools/SchoolsPage";
import StudentsPage from "./components/students/StudentsPage";

export type AnyRouteComponentProps = RouteComponentProps<any>;

export interface IRoute {
    title: string;
    url: string;
    component: React.ComponentType<AnyRouteComponentProps>;
}

const logInRoute: IRoute = {
    title: "Login",
    url: "/login",
    component: LoginPage,
};

const appRoute: IRoute = {
    title: "",
    url: "/app",
    component: AppContainer,
};

const planningsRoute: IRoute = {
    title: "Planning",
    url: makeAppRoute("planning"),
    component: PlanningsPage,
};

const studentsRoute: IRoute = {
    title: "Studenten",
    url: makeAppRoute("students"),
    component: StudentsPage,
};

const schoolsRoute: IRoute = {
    title: "Scholen",
    url: makeAppRoute("schools"),
    component: SchoolsPage,
};

const educationsRoute: IRoute = {
    title: "Opleidingen",
    url: makeAppRoute("educations"),
    component: EducationsPage,
};

const departmentsRoute: IRoute = {
    title: "Afdelingen",
    url: makeAppRoute("departments"),
    component: DepartmentsPage,
};

function makeAppRoute(url: string): string {
    return `${appRoute.url}/${url}`;
}

export const routes = {
    logInRoute,
    appRoute,
    planningsRoute,
    studentsRoute,
    schoolsRoute,
    educationsRoute,
    departmentsRoute,
};
