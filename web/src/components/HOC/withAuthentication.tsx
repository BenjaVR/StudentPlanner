import React from "react";
import { Redirect } from "react-router";
import { routes } from "../../routes";

export interface IWithAuthenticationState {
    isAuthenticated: boolean;
}

const withAuthentication = <P extends object>(Component: React.ComponentType<P>) => {
    return class WithAuthentication extends React.Component<P, IWithAuthenticationState> {

        constructor(props: P) {
            super(props);

            this.state = {
                isAuthenticated: true,
            };
        }

        public render(): React.ReactNode {
            return this.state.isAuthenticated
                ? <Component {...this.props}/>
                : <Redirect to={routes.logInRoute.url}/>;
        }
    };
};

export default withAuthentication;
