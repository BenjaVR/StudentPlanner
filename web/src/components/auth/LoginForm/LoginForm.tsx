import { Button, Form, Icon, Input, notification } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import * as React from "react";
import { Firebase } from "../../../config/FirebaseInitializer";
import { ILoginDetails } from "../../../models/LoginDetails";

interface ILoginFormProps {
}

type LoginFormProps = ILoginFormProps & FormComponentProps;

interface ILoginFormState {
    isSubmitting: boolean;
}

class LoginForm extends React.Component<LoginFormProps, ILoginFormState> {

    constructor(props: LoginFormProps) {
        super(props);

        this.state = {
            isSubmitting: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    public render(): React.ReactNode {
        const { getFieldDecorator } = this.props.form;

        return (
            <React.Fragment>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem>
                        {getFieldDecorator<ILoginDetails>("username", {
                            rules: [
                                { required: true },
                            ],
                        })(
                            <Input
                                prefix={<Icon type="user" />}
                                placeholder="E-mail"
                                disabled={this.state.isSubmitting}
                            />,
                        )}
                    </FormItem>

                    <FormItem>
                        {getFieldDecorator<ILoginDetails>("password", {
                            rules: [
                                { required: true },
                            ],
                        })(
                            <Input
                                type="password"
                                prefix={<Icon type="lock" />}
                                placeholder="Wachtwoord"
                                disabled={this.state.isSubmitting}
                            />,
                        )}
                    </FormItem>

                    <FormItem>
                        <Button type="primary" htmlType="submit" loading={this.state.isSubmitting}>
                            Log in
                        </Button>
                    </FormItem>
                </Form>
            </React.Fragment>
        );
    }

    private handleSubmit(event: React.FormEvent): void {
        event.preventDefault();

        this.setState({
            isSubmitting: true,
        });

        const fields: Array<keyof ILoginDetails> = ["username", "password"];
        this.props.form.validateFieldsAndScroll(fields, (errors, values) => {
            if (!errors) {
                const loginDetails: ILoginDetails = values;
                Firebase.auth().signInWithEmailAndPassword(loginDetails.username, loginDetails.password)
                    .then(() => {
                        // TODO
                    })
                    .catch(() => {
                        // TODO
                    })
                    .finally(() => {
                        this.setState({
                            isSubmitting: false,
                        });
                    });
            }
        });
    }

    private handleLogout(event: React.FormEvent): void {
        event.preventDefault();

        Firebase.auth().signOut()
            .then(() => {
                notification.success({
                    message: "Succesvol uitgelogd",
                });
            })
            .catch(() => {
                notification.error({
                    message: "Iets ging fout bij het uitloggen... Was u al uitgelogd?",
                });
            });
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
            this.props.actions.login(fieldValues);
        }
    }
}

const WrappedLoginForm = Form.create<ILoginFormProps>()(LoginForm);

export default WrappedLoginForm;
