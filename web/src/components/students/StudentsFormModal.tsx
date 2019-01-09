import { Form, Input, Modal, Select } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import React from "react";
import { FormValidationTrigger } from "../../helpers/types";
import { ISchool } from "../../models/School";
import { IStudent } from "../../models/Student";

interface IStudentsFormModalProps {
    title: string;
    okText: string;
    isVisible: boolean;
    studentToEdit: IStudent | undefined;
    schools: ISchool[];
    isLoadingSchools: boolean;
    onCloseRequest: () => void;
    submitStudent(student: IStudent): Promise<void>;
}

type StudentFormModalProps = IStudentsFormModalProps & FormComponentProps;

interface IStudentsFormModalState {
    isSubmitting: boolean;
    formValidateTrigger: FormValidationTrigger;
}

class StudentsFormModal extends React.Component<StudentFormModalProps, IStudentsFormModalState> {

    constructor(props: StudentFormModalProps) {
        super(props);

        this.state = {
            isSubmitting: false,
            formValidateTrigger: "",
        };

        this.doClose = this.doClose.bind(this);
        this.handleOk = this.handleOk.bind(this);
    }

    public componentDidUpdate(prevProps: StudentFormModalProps): void {
        // Populate the form if it is just opened and if a student to edit is passed.
        if (this.props.studentToEdit !== undefined
            && this.props.isVisible === true
            && prevProps.isVisible === false) {

            let schoolId;
            const studentSchoolId = this.props.studentToEdit.schoolId;
            if (studentSchoolId !== undefined) {
                schoolId = this.props.schools.some((s) => s.id === studentSchoolId)
                    ? studentSchoolId
                    : undefined;
            }

            this.props.form.setFieldsValue({ // TODO: fill these keys dynamically
                firstName: this.props.studentToEdit.firstName,
                lastName: this.props.studentToEdit.lastName,
                schoolId,
            });
        }
    }

    public render(): React.ReactNode {
        const { getFieldDecorator } = this.props.form;

        return (
            <Modal
                visible={this.props.isVisible}
                title={this.props.title}
                onCancel={this.doClose}
                onOk={this.handleOk}
                okText={this.props.okText}
                confirmLoading={this.state.isSubmitting}
                destroyOnClose={true}
            >
                <Form layout="horizontal">
                    <FormItem label="Voornaam">
                        {getFieldDecorator<IStudent>("firstName", {
                            validateTrigger: this.state.formValidateTrigger,
                            rules: [
                                { required: true, message: "Voornaam mag niet leeg zijn" },
                            ],
                        })(
                            <Input
                                autoFocus={true}
                                disabled={this.state.isSubmitting}
                            />,
                        )}
                    </FormItem>
                    <FormItem label="Familienaam">
                        {getFieldDecorator<IStudent>("lastName", {
                            validateTrigger: this.state.formValidateTrigger,
                        })(
                            <Input
                                disabled={this.state.isSubmitting}
                            />,
                        )}
                    </FormItem>
                    <FormItem label="School">
                        {getFieldDecorator<IStudent>("schoolId", {
                            validateTrigger: this.state.formValidateTrigger,
                        })(
                            <Select
                                disabled={this.state.isSubmitting}
                                loading={this.props.isLoadingSchools}
                                allowClear={true}
                            >
                                {this.props.schools.map(this.renderSchoolSelectOption)}
                            </Select>,
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }

    private renderSchoolSelectOption(school: ISchool): React.ReactNode {
        return (
            <Select.Option key={school.id} value={school.id}>{school.name}</Select.Option>
        );
    }

    private doClose(): void {
        this.props.onCloseRequest();
    }

    private handleOk(): void {
        // Do real-time validation (while typing) only after the first submit.
        this.setState({
            formValidateTrigger: "onChange",
        });

        const fields: Array<keyof IStudent> = ["firstName", "lastName", "schoolId"];
        this.props.form.validateFieldsAndScroll(fields, (errors, values) => {
            if (!errors) {
                this.setState({
                    isSubmitting: true,
                });

                const student: IStudent = {
                    ...values,
                };
                this.props.submitStudent(student)
                    .then(() => {
                        this.doClose();
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

const WrappedStudentsFormModal = Form.create<IStudentsFormModalProps>()(StudentsFormModal);
export default WrappedStudentsFormModal;
