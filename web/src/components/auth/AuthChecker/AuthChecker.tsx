import { notification, Spin } from "antd";
import React from "react";
import { Firebase } from "../../../config/FirebaseInitializer";
import styles from "./AuthChecker.module.scss";

interface IAuthCheckerProps {
}

interface IAuthCheckerState {
    initialCheckDone: boolean;
}

class AuthChecker extends React.Component<IAuthCheckerProps, IAuthCheckerState> {

    /**
     * This is to check if the user is refreshing the page, or actually opening it again in an new browser session.
     */
    private pageWasReloaded: boolean;
    private readonly pageWasReloadedSessionKey = "StudentPlanner_PageReloaded";

    constructor(props: IAuthCheckerProps) {
        super(props);

        this.state = {
            initialCheckDone: false,
        };

        const sessionReloadedValue = sessionStorage.getItem(this.pageWasReloadedSessionKey);
        this.pageWasReloaded = sessionReloadedValue !== null ? JSON.parse(sessionReloadedValue) === true : false;
    }

    public componentDidMount(): void {
        Firebase.auth().onAuthStateChanged((user) => {
            if (user && !this.state.initialCheckDone && !this.pageWasReloaded) {
                const hasName = user.displayName !== null;
                notification.success({
                    message: hasName ? `Welkom terug, ${user.displayName}!` : "Welkom terug!",
                });
            }

            sessionStorage.setItem(this.pageWasReloadedSessionKey, JSON.stringify(true));
            this.pageWasReloaded = true;

            this.setState({
                initialCheckDone: true,
            });
        });
    }

    public render(): React.ReactNode {
        return (
            <Spin spinning={!this.state.initialCheckDone} size="large" className={styles.spinner}>
                <div>
                    {this.state.initialCheckDone &&
                        this.props.children
                    }
                </div>
            </Spin>
        );
    }
}

export default AuthChecker;
