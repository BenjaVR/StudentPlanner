import { Spin } from "antd";
import firebase from "firebase";
import React from "react";
import { connect, MapStateToProps } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { login } from "../../stores/Auth/loginActions";

interface IAuthCheckerProps {
}

interface IAuthCheckerState {
    isAuthCheckDone: boolean;
}

class AuthChecker extends React.Component<IAuthCheckerProps, IAuthCheckerState> {
    constructor(props: IAuthCheckerProps) {
        super(props);

        this.state = {
            isAuthCheckDone: false,
        };
    }

    public componentDidMount(): void {
        firebase.auth().onAuthStateChanged((user) => {
            console.log(user);
        });

        window.setTimeout(() => {
            this.setState({
                isAuthCheckDone: true,
            });
        });
    }

    public render(): React.ReactNode {
        return this.state.isAuthCheckDone
            ? this.props.children
            : <Spin size="large" />;
    }
}

export default AuthChecker;
// export default connect<IAuthState>(mapStateToProps, mapDispatchToProps)(AuthChecker);
