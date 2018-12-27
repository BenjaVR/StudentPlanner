import React from "react";
import { RoutePageComponentProps } from "../../../routes";
import EmptyCenteredLayout from "../../layouts/EmptyCenteredLayout";
import { LoginForm } from "../LoginForm";
import style from "./LoginPage.module.scss";

type LoginPageProps = RoutePageComponentProps;

const LoginPage: React.FunctionComponent<LoginPageProps> = () => (
    <EmptyCenteredLayout>
        <div className={style.title}>
            <h1>Student Planner</h1>
        </div>
        <LoginForm />
    </EmptyCenteredLayout>
);

export default LoginPage;
