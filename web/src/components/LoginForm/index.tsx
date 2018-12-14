import { Button, Form, Icon, Input, Spin } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { IApplicationState } from "../../stores";
import { checkLoggedIn } from "../../stores/Auth/checkLoggedInAction";
import { login } from "../../stores/Auth/loginActions";
import { logout } from "../../stores/Auth/logoutActions";
import { IAuthState } from "../../stores/Auth/reducer";

interface ILoginFormProps {
}

type LoginFormProps = ILoginFormProps & FormComponentProps & IStateProps & IDispatchProps;

interface ILoginFormState {
}

class LoginForm extends React.Component<LoginFormProps, ILoginFormState> {

    constructor(props: LoginFormProps) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    public componentDidMount(): void {
        this.props.checkLoggedIn();
    }

    public render(): React.ReactNode {
        const { getFieldDecorator } = this.props.form;

        return (
            <React.Fragment>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator("userName", {
                            rules: [{ required: true, message: "Please input your username!" }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }}/>}
                                placeholder="Username"
                            />,
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator("password", {
                            rules: [{ required: true, message: "Please input your Password!" }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }}/>}
                                type="password"
                                placeholder="Password"
                            />,
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                    </FormItem>
                </Form>

                <p>STATUS: {this.props.auth.status}</p>
                {this.props.auth.user && this.props.auth.status === "AUTHENTICATED" &&
                <h1>Welcome, {this.props.auth.user.email}!</h1>
                }

                {this.props.auth.status === "AUTHENTICATED" &&
                <Button type="dashed" onClick={this.handleLogout} htmlType="button">Log out</Button>
                }

                {this.props.auth.status === "INITIAL_AUTH_CHECKING" &&
                <Spin size="large"/>
                }
            </React.Fragment>
        );
    }

    private handleSubmit(event: React.FormEvent): void {
        event.preventDefault();

        // TODO: type error array
        this.props.form.validateFields((errors, fields) => {
            if (!errors) {
                // TODO: make fields typed
                this.props.login(fields["userName"], fields["password"]);
            }
        });
    }

    private handleLogout(event: React.FormEvent): void {
        event.preventDefault();

        this.props.logout();
    }
}

interface IStateProps {
    auth: IAuthState;
}

function mapStateToProps(state: IApplicationState): IStateProps {
    return {
        auth: state.auth,
    };
}

interface IDispatchProps {
    login: (username: string, password: string) => void;
    logout: () => void;
    checkLoggedIn: () => void;
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return {
        login: bindActionCreators(login, dispatch),
        logout: bindActionCreators(logout, dispatch),
        checkLoggedIn: bindActionCreators(checkLoggedIn, dispatch),
    };
}

const ConnectedLoginForm = connect<IStateProps, IDispatchProps, ILoginFormProps, IApplicationState>(
    mapStateToProps, mapDispatchToProps)(LoginForm);
const WrappedLoginForm = Form.create<ILoginFormProps>()(ConnectedLoginForm);

export default WrappedLoginForm;
