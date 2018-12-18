import { Button, Form, Icon, Input } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import * as React from "react";
import { withNamespaces, WithNamespaces } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ILoginDetails, validateLoginDetails } from "shared/dist/models/LoginDetails";
import { ValidationError } from "shared/dist/validators/ValidationError";
import { IApplicationState } from "../../../stores";
import { login, logout } from "../../../stores/auth/actions";
import { IAuthState } from "../../../stores/auth/reducer";

interface ILoginFormProps {
}

type LoginFormProps = ILoginFormProps & FormComponentProps & IStateProps & IDispatchProps & WithNamespaces;

interface ILoginFormState {
    doValidateOnChange: boolean;
    usernameErrors: Array<ValidationError<ILoginDetails>>;
    passwordErrors: Array<ValidationError<ILoginDetails>>;
}

class LoginForm extends React.Component<LoginFormProps, ILoginFormState> {

    constructor(props: LoginFormProps) {
        super(props);

        this.state = {
            doValidateOnChange: false,
            usernameErrors: [],
            passwordErrors: [],
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    public render(): React.ReactNode {
        const { getFieldDecorator } = this.props.form;
        const { t } = this.props;

        return (
            <React.Fragment>
                <Form onSubmit={this.handleSubmit} onChange={this.handleFormChange}>
                    <FormItem
                        validateStatus={this.state.usernameErrors.length > 0 ? "error" : "success"}
                        help={this.state.usernameErrors.length > 0 ? t(`${this.state.usernameErrors[0].translationKey}`) : ""}
                    >
                        {getFieldDecorator<ILoginDetails>("username")(
                            <Input
                                prefix={<Icon type="user"/>}
                                placeholder="Username"
                                disabled={this.props.authStore.status === "LOGGING_IN"}
                            />,
                        )}
                    </FormItem>

                    <FormItem
                        validateStatus={this.state.passwordErrors.length > 0 ? "error" : "success"}
                        help={this.state.passwordErrors.length > 0 ? t(`${this.state.passwordErrors[0].translationKey}`) : ""}
                    >
                        {getFieldDecorator<ILoginDetails>("password")(
                            <Input
                                type="password"
                                prefix={<Icon type="lock"/>}
                                placeholder="Password"
                                disabled={this.props.authStore.status === "LOGGING_IN"}
                            />,
                        )}
                    </FormItem>

                    <FormItem>
                        <Button type="primary" htmlType="submit" loading={this.props.authStore.status === "LOGGING_IN"}>
                            Log in
                        </Button>
                    </FormItem>
                </Form>

                <p>STATUS: {this.props.authStore.status}</p>
                {this.props.authStore.user &&
                <h1>Welcome, {this.props.authStore.user.email}!</h1>
                }

                {this.props.authStore.status === "LOGGED_IN" &&
                <Button type="dashed" onClick={this.handleLogout} htmlType="button">Log out</Button>
                }
            </React.Fragment>
        );
    }

    private handleSubmit(event: React.FormEvent): void {
        event.preventDefault();

        this.validateForm(true);
    }

    private handleFormChange(event: React.FormEvent): void {
        event.preventDefault();

        if (this.state.doValidateOnChange) {
            this.validateForm(false);
        }
    }

    private handleLogout(event: React.FormEvent): void {
        event.preventDefault();

        this.props.logout();
    }

    private validateForm(doLogin: boolean): void {
        const fields: Array<keyof ILoginDetails> = [
            "username",
            "password",
        ];
        const fieldValues = this.props.form.getFieldsValue(fields) as ILoginDetails;

        const validation = validateLoginDetails(fieldValues);

        this.setState({
            doValidateOnChange: true,
            usernameErrors: validation.getErrorsWithField("username"),
            passwordErrors: validation.getErrorsWithField("password"),
        });

        if (!validation.hasErrors() && doLogin) {
            this.props.login(fieldValues);
        }
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
    login: (loginDetails: ILoginDetails) => void;
    logout: () => void;
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return {
        login: bindActionCreators(login, dispatch),
        logout: bindActionCreators(logout, dispatch),
    };
}

const ConnectedLoginForm = connect<IStateProps, IDispatchProps, ILoginFormProps, IApplicationState>(
    mapStateToProps, mapDispatchToProps)(LoginForm);
const WrappedLoginForm = Form.create<ILoginFormProps>()(ConnectedLoginForm);

export default withNamespaces()(WrappedLoginForm);
