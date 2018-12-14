import { Spin } from "antd";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { IApplicationState } from "../../stores";
import { checkLoggedIn } from "../../stores/Auth/checkLoggedInAction";
import { AuthStatus } from "../../stores/Auth/reducer";

interface IAuthCheckerProps {
}

type AuthCheckerProps = IAuthCheckerProps & IStateProps & IDispatchProps;

interface IAuthCheckerState {
}

class AuthChecker extends React.Component<AuthCheckerProps, IAuthCheckerState> {

    public componentDidMount(): void {
        this.props.checkLoggedIn();
    }

    public render(): React.ReactNode {
        return (
            <Spin  spinning={this.props.authState === "INITIAL_AUTH_CHECKING"} size="large">
                {this.props.children}
            </Spin>
        );
    }
}

interface IStateProps {
    authState: AuthStatus;
}

function mapStateToProps(state: IApplicationState): IStateProps {
    return {
        authState: state.auth.status,
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

export { ConnectedAuthChecker as AuthChecker };
