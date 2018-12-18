import { notification, Spin } from "antd";
import React from "react";
import { withNamespaces, WithNamespaces } from "react-i18next";
import { connect, MapStateToProps } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ITranslations } from "shared/dist/translations/types";
import { IApplicationState } from "../../../stores";
import { checkLoggedIn } from "../../../stores/auth/actions";
import { IAuthState } from "../../../stores/auth/reducer";

interface IAuthCheckerProps {
}

type AuthCheckerProps = IAuthCheckerProps & IStateProps & IDispatchProps & WithNamespaces;

interface IAuthCheckerState {
}

class AuthChecker extends React.Component<AuthCheckerProps, IAuthCheckerState> {

    /**
     * This is to check if the user is refreshing the page, or actually opening it again in an new browser session.
     */
    private pageWasReloaded: boolean;
    private readonly pageWasReloadedSessionKey = "StudentPlanner_PageReloaded";

    constructor(props: AuthCheckerProps) {
        super(props);

        const sessionReloadedValue = sessionStorage.getItem(this.pageWasReloadedSessionKey);
        this.pageWasReloaded = sessionReloadedValue !== null ? JSON.parse(sessionReloadedValue) === true : false;
    }

    public componentDidMount(): void {
        this.props.actions.checkLoggedIn();
    }

    public componentDidUpdate(prevProps: AuthCheckerProps): void {
        const { t } = this.props;

        if (prevProps.authStore.status === "LOGGING_IN" && this.props.authStore.status === "LOGGED_IN") {
            this.setPageReloaded();
            const message: keyof ITranslations = "auth.logged_in_successfully";
            notification.success({ message: t(message) });
        }

        if (prevProps.authStore.status === "LOGGING_IN" && this.props.authStore.status === "LOGGED_OUT") {
            const message: keyof ITranslations = "auth.logging_in_failed";
            notification.error({ message: t(message) });
        }

        if (prevProps.authStore.status === "CHECKING_LOGGED_IN" && this.props.authStore.status === "LOGGED_IN" && !this.pageWasReloaded) {
            this.setPageReloaded();
            const message: keyof ITranslations = "auth.welcome_back{{username}}";
            const user = this.props.authStore.user as firebase.User;
            notification.success({
                message: t(message, {
                    username: user.displayName !== null ? user.displayName : user.email,
                }),
            });
        }

        if (prevProps.authStore.status === "LOGGING_OUT" && this.props.authStore.status === "LOGGED_OUT") {
            const message: keyof ITranslations = "auth.logged_out_successfully";
            notification.success({ message: t(message) });
        }
    }

    public render(): React.ReactNode {
        return (
            <Spin spinning={this.props.authStore.status === "CHECKING_LOGGED_IN"} size="large">
                {this.props.children}
            </Spin>
        );
    }

    private setPageReloaded(): void {
        sessionStorage.setItem(this.pageWasReloadedSessionKey, JSON.stringify(true));
        this.pageWasReloaded = true;
    }
}

interface IStateProps {
    authStore: IAuthState;
}

function mapStateToProps(state: IApplicationState): IStateProps {
    return {
        authStore: state.auth,
    };
}

interface IDispatchProps {
    actions: {
        checkLoggedIn: () => void;
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return {
        actions: bindActionCreators({
            checkLoggedIn,
        }, dispatch),
    };
}

const ConnectedAuthChecker = connect<IStateProps, IDispatchProps, IAuthCheckerProps, IApplicationState>(
    mapStateToProps, mapDispatchToProps)(AuthChecker);

export default withNamespaces()(ConnectedAuthChecker);
