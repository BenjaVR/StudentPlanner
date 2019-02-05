import { Col, Layout, Row } from "antd";
import React from "react";
import Helmet from "react-helmet";
import { Redirect } from "react-router-dom";
import { AnyRouteComponentProps, routes } from "../../../routes";
import { Firebase } from "../../../services/FirebaseInitializer";
import LoginForm from "./LoginForm";
import styles from "./LoginPage.module.scss";

type LoginPageProps = AnyRouteComponentProps;

class LoginPage extends React.Component<LoginPageProps> {

    constructor(props: LoginPageProps) {
        super(props);

        this.goToAuthenticatedApp = this.goToAuthenticatedApp.bind(this);
    }

    public render(): React.ReactNode {
        if (Firebase.auth().currentUser !== null) {
            return <Redirect to={routes.appRoute.url} />;
        }
        return (
            <React.Fragment>
                <Helmet>
                    <title>{routes.logInRoute.title}</title>
                </Helmet>
                <Layout className={styles.layout}>
                    <Row type="flex" justify="space-around" align="middle" className={styles.row}>
                        <Col>
                            <div className={styles.title}>
                                <h1>Student Planner</h1>
                            </div>
                            <LoginForm loginSuccessfulCallback={this.goToAuthenticatedApp} />
                        </Col>
                    </Row>
                </Layout>
            </React.Fragment>
        );
    }

    private goToAuthenticatedApp(): void {
        this.props.history.push(routes.appRoute.url);
    }
}

export default LoginPage;
