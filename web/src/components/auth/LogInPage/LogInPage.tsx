import React from "react";
import { RoutePageComponentProps } from "../../../routes";

interface ILogInPageProps extends RoutePageComponentProps {
}

class LogInPage extends React.Component<ILogInPageProps> {
    public render(): React.ReactNode {
        return <h1>LOG IN PLIS</h1>;
    }
}

export default LogInPage;
