import React from "react";
import Helmet from "react-helmet";
import { RoutePageComponentProps, routes } from "../../../routes";
import NotAuthenticatedAppContainer from "../../containers/NotAuthenticatedAppContainer";
import LoginForm from "./LoginForm";
import style from "./LoginPage.module.scss";

type LoginPageProps = RoutePageComponentProps;

class LoginPage extends React.Component<LoginPageProps> {

    constructor(props: LoginPageProps) {
        super(props);

        this.goToAuthenticatedApp = this.goToAuthenticatedApp.bind(this);
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <Helmet>
                    <title>{routes.logInRoute.title}</title>
                </Helmet>
                <NotAuthenticatedAppContainer>
                    <div className={style.title}>
                        <h1>Student Planner</h1>
                    </div>
                    <LoginForm loginSuccessfulCallback={this.goToAuthenticatedApp} />
                </NotAuthenticatedAppContainer>
            </React.Fragment>
        );
    }

    private goToAuthenticatedApp(): void {
        this.props.history.push(routes.signedInHomeRoute.url);
    }
}

export default LoginPage;
