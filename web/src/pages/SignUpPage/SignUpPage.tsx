import React from "react";
import { RoutePageComponentProps } from "../../routes";

interface ISignUpPageProps extends RoutePageComponentProps {
}

export default class SignUpPage extends React.Component<ISignUpPageProps> {
    public render(): React.ReactNode {
        return <h1>SIGN UP PLIS</h1>;
    }
}
