import React from "react";
import Helmet from "react-helmet";
import { RoutePageComponentProps, routes } from "../../../routes";
import EmptyCenteredLayout from "../../layouts/EmptyCenteredLayout";
import LoginForm from "./LoginForm";
import style from "./LoginPage.module.scss";

type LoginPageProps = RoutePageComponentProps;

const LoginPage: React.FunctionComponent<LoginPageProps> = () => (
    <React.Fragment>
        <Helmet>
            <title>{routes.logInRoute.title}</title>
        </Helmet>
        <EmptyCenteredLayout>
            <div className={style.title}>
                <h1>Student Planner</h1>
            </div>
            <LoginForm />
        </EmptyCenteredLayout>
    </React.Fragment>
);

export default LoginPage;
