import { Button, Card, Form, Icon, Input, notification } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import * as React from "react";
import { ILoginDetails } from "studentplanner-functions/shared/contract/ILoginDetails";
import { FormValidationTrigger } from "../../../helpers/types";
import { Firebase } from "../../../services/FirebaseInitializer";
import styles from "./LoginForm.module.scss";

interface ILoginFormProps {
    loginSuccessfulCallback?: () => void;
}

type LoginFormProps = ILoginFormProps & FormComponentProps;

interface ILoginFormState {
    isSubmitting: boolean;
    formValidateTrigger: FormValidationTrigger;
}

class LoginForm extends React.Component<LoginFormProps, ILoginFormState> {

    public static defaultProps: Partial<LoginFormProps> = {
        loginSuccessfulCallback: () => { return; },
    };

    constructor(props: LoginFormProps) {
        super(props);

        this.state = {
            isSubmitting: false,
            formValidateTrigger: "",
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
                            validateTrigger: this.state.formValidateTrigger,
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
                            validateTrigger: this.state.formValidateTrigger,
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

        // Do real-time validation (while typing) only after the first submit.
        this.setState({
            formValidateTrigger: "onChange",
        });

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
                    notification.success({
                        message: "Succesvol ingelogd!",
                    });
                    this.setState({
                        isSubmitting: false,
                    });
                    this.props.loginSuccessfulCallback!();
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
                    this.setState({
                        isSubmitting: false,
                    });
                });
        });
    }
}

const WrappedLoginForm = Form.create<ILoginFormProps>()(LoginForm);

export default WrappedLoginForm;
