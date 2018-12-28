import { Button, Card, Form, Icon, Input, notification } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import * as React from "react";
import { Firebase } from "../../../config/FirebaseInitializer";
import { ILoginDetails } from "../../../models/LoginDetails";
import styles from "./LoginForm.module.scss";

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
    }

    public render(): React.ReactNode {
        const { getFieldDecorator } = this.props.form;

        return (
            <Card className={styles.card}>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem>
                        {getFieldDecorator<ILoginDetails>("username", {
                            rules: [
                                { required: true, message: "E-mail mag niet leeg zijn" },
                                { type: "email", message: "Dit e-mailadres heeft geen geldig formaat" },
                            ],
                        })(
                            <Input
                                autoFocus={true}
                                prefix={<Icon type="user" />}
                                placeholder="E-mail"
                                disabled={this.state.isSubmitting}
                            />,
                        )}
                    </FormItem>

                    <FormItem>
                        {getFieldDecorator<ILoginDetails>("password", {
                            rules: [
                                { required: true, message: "Wachtwoord mag niet leeg zijn" },
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

                    <FormItem className={styles.submitButtonFormItem}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={this.state.isSubmitting}
                            className={styles.submitButton}
                        >
                            Log in
                        </Button>
                    </FormItem>
                </Form>
            </Card>
        );
    }

    private handleSubmit(event: React.FormEvent): void {
        event.preventDefault();

        const fields: Array<keyof ILoginDetails> = ["username", "password"];

        this.props.form.validateFieldsAndScroll(fields, (errors, values) => {
            if (errors) {
                return;
            }

            this.setState({
                isSubmitting: true,
            });

            const loginDetails: ILoginDetails = values;
            Firebase.auth().signInWithEmailAndPassword(loginDetails.username, loginDetails.password)
                .then(({ user }) => {
                    const message = user !== null && user.displayName !== null
                        ? `Succesvol ingelogd, welkom ${user.displayName}!`
                        : "Succesvol ingelogd";
                    notification.success({
                        message,
                    });
                })
                .catch((error: firebase.FirebaseError) => {
                    switch (error.code) {
                        case "auth/user-not-found":
                            this.props.form.setFields({
                                username: {
                                    value: this.props.form.getFieldValue("username"),
                                    errors: [new Error("Er bestaat geen gebruiker met dit e-mailadres")],
                                },
                            });
                            break;
                        case "auth/wrong-password":
                            this.props.form.setFields({
                                password: { errors: [new Error("Wachtwoord is fout")] },
                            });
                            break;
                        default:
                            notification.error({ message: "Er ging iets fout bij het inloggen, probeer later opnieuw" });
                    }
                })
                .finally(() => {
                    this.setState({
                        isSubmitting: false,
                    });
                });
        });
    }
}

const WrappedLoginForm = Form.create<ILoginFormProps>()(LoginForm);

export default WrappedLoginForm;
