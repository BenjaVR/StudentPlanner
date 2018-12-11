import React from "react";
import { RoutePageComponentProps } from "../../routes";

interface ILogInPageProps extends RoutePageComponentProps {
}

export default class LogInPage extends React.Component<ILogInPageProps> {
    public render(): React.ReactNode {
        return <h1>LOG IN PLIS</h1>;
    }
}
