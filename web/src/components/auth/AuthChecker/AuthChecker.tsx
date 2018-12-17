import { notification, Spin } from "antd";
import React from "react";
import { withNamespaces, WithNamespaces } from "react-i18next";
import { connect } from "react-redux";
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

    public componentDidMount(): void {
        this.props.checkLoggedIn();
    }

    public componentDidUpdate(prevProps: AuthCheckerProps): void {
        const { t } = this.props;

        if (prevProps.authStore.status === "LOGGING_IN" && this.props.authStore.status === "LOGGED_IN") {
            const message: keyof ITranslations = "auth.logged_in_successfully";
            notification.success({ message: t(message) });
        }

        if (prevProps.authStore.status === "LOGGING_IN" && this.props.authStore.status === "LOGGED_OUT") {
            const message: keyof ITranslations = "auth.logging_in_failed";
            notification.error({ message: t(message) });
        }

        // performance.navigation.type === 1 means a page refresh, and we do not show the "welcome back" message in that case.
        if (prevProps.authStore.status === "CHECKING_LOGGED_IN" && this.props.authStore.status === "LOGGED_IN" && performance.navigation.type !== 1) {
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
            notification.info({ message: t(message) });
        }
    }

    public render(): React.ReactNode {
        return (
            <Spin spinning={this.props.authStore.status === "CHECKING_LOGGED_IN"} size="large">
                {this.props.children}
            </Spin>
        );
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
    checkLoggedIn: () => void;
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return {
        checkLoggedIn: bindActionCreators(checkLoggedIn, dispatch),
    };
}

const ConnectedAuthChecker = connect<IStateProps, IDispatchProps, IAuthCheckerProps, IApplicationState>(
    mapStateToProps, mapDispatchToProps)(AuthChecker);

export default withNamespaces()(ConnectedAuthChecker);
