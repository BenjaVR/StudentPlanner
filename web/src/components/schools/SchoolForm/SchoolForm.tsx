import { Button, Form, Input } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import React from "react";
import { ISchool } from "../../../models/School";

interface ISchoolFormProps {
    submitSchool(school: ISchool): Promise<void>;
}

type SchoolFormProps = ISchoolFormProps & FormComponentProps;

interface ISchoolFormState {
    isSubmitting: boolean;
}

class SchoolForm extends React.Component<SchoolFormProps, ISchoolFormState> {

    constructor(props: SchoolFormProps) {
        super(props);

        this.state = {
            isSubmitting: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public render(): React.ReactNode {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem>
                    {getFieldDecorator<ISchool>("name", {
                        rules: [
                            { required: true },
                        ],
                    })(
                        <Input
                            placeholder="Naam"
                            disabled={this.state.isSubmitting}
                        />,
                    )}
                </FormItem>

                <FormItem>
                    <Button type="primary" htmlType="submit" loading={this.state.isSubmitting}>
                        Voeg toe
                    </Button>
                </FormItem>
            </Form>
        );
    }

    private handleSubmit(event: React.FormEvent): void {
        event.preventDefault();

        this.setState({
            isSubmitting: true,
        });

        const fields: Array<keyof ISchool> = ["name"];
        this.props.form.validateFieldsAndScroll(fields, (errors, values) => {
            if (!errors) {
                const school: ISchool = {
                    ...values,
                };
                this.props.submitSchool(school)
                    .then(() => {
                        this.props.form.resetFields();
                    })
                    .finally(() => {
                        this.setState({
                            isSubmitting: false,
                        });
                    });
            }
        });
    }
}

const WrappedSchoolForm = Form.create<ISchoolFormProps>()(SchoolForm);

export default WrappedSchoolForm;
