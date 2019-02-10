import { Checkbox, Form, Input, Modal, Select } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import React from "react";
import { nameof } from "../../helpers/nameof";
import { FormValidationTrigger } from "../../helpers/types";
import { Education } from "../../models/Education";
import { School } from "../../models/School";
import { Student } from "../../models/Student";

interface IStudentsFormModalProps {
    title: string;
    okText: string;
    isVisible: boolean;
    studentToEdit: Student | undefined;
    schools: School[];
    isLoadingSchools: boolean;
    educations: Education[];
    isLoadingEducations: boolean;
    onCloseRequest: () => void;
    submitStudent(student: Student): Promise<void>;
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

        this.handleClose = this.handleClose.bind(this);
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

            let educationId;
            const studentEducationId = this.props.studentToEdit.educationId;
            if (studentEducationId !== undefined) {
                educationId = this.props.educations.some((e) => e.id === studentEducationId)
                    ? studentEducationId
                    : undefined;
            }

            const studentFields: Partial<Student> = {
                firstName: this.props.studentToEdit.firstName,
                lastName: this.props.studentToEdit.lastName,
                isConfirmed: this.props.studentToEdit.isConfirmed,
                schoolId,
                educationId,
            };

            this.props.form.setFieldsValue(studentFields);
        }
    }

    public render(): React.ReactNode {
        const { getFieldDecorator } = this.props.form;

        return (
            <Modal
                visible={this.props.isVisible}
                title={this.props.title}
                onCancel={this.handleClose}
                onOk={this.handleOk}
                okText={this.props.okText}
                confirmLoading={this.state.isSubmitting}
                destroyOnClose={true}
            >
                <Form layout="horizontal">
                    <FormItem label="Voornaam">
                        {getFieldDecorator<Student>("firstName", {
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
                        {getFieldDecorator<Student>("lastName", {
                            validateTrigger: this.state.formValidateTrigger,
                        })(
                            <Input
                                disabled={this.state.isSubmitting}
                            />,
                        )}
                    </FormItem>
                    <FormItem label="School">
                        {getFieldDecorator<Student>("schoolId", {
                            validateTrigger: this.state.formValidateTrigger,
                        })(
                            <Select
                                disabled={this.state.isSubmitting}
                                loading={this.props.isLoadingSchools}
                                allowClear={true}
                                showSearch={true}
                                filterOption={true}
                                optionFilterProp="children"
                            >
                                {this.props.schools.map(this.renderSchoolSelectOption)}
                            </Select>,
                        )}
                    </FormItem>
                    <FormItem label="Opleiding">
                        {getFieldDecorator<Student>("educationId", {
                            validateTrigger: this.state.formValidateTrigger,
                        })(
                            <Select
                                disabled={this.state.isSubmitting}
                                loading={this.props.isLoadingEducations}
                                allowClear={true}
                                showSearch={true}
                                filterOption={true}
                                optionFilterProp="children"
                            >
                                {this.props.educations.map(this.renderEducationSelectOption)}
                            </Select>,
                        )}
                    </FormItem>
                    <FormItem label="Bevestiging">
                        {getFieldDecorator<Student>("isConfirmed", {
                            validateTrigger: this.state.formValidateTrigger,
                            valuePropName: "checked",
                        })(
                            <Checkbox disabled={this.state.isSubmitting}>Student is bevestigd door de school</Checkbox>,
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }

    private renderSchoolSelectOption(school: School): React.ReactNode {
        return (
            <Select.Option key={school.id} value={school.id}>{school.name}</Select.Option>
        );
    }

    private renderEducationSelectOption(education: Education): React.ReactNode {
        return (
            <Select.Option key={education.id} value={education.id}>{education.name}</Select.Option>
        );
    }

    private handleClose(): void {
        this.props.onCloseRequest();
    }

    private handleOk(): void {
        // Do real-time validation (while typing) only after the first submit.
        this.setState({
            formValidateTrigger: "onChange",
        });

        const fields: Array<keyof Student> = ["firstName", "lastName", "schoolId", "educationId", "isConfirmed"];
        this.props.form.validateFieldsAndScroll(fields, (errors, values) => {
            if (!errors) {
                this.setState({
                    isSubmitting: true,
                });

                const student = new Student(
                    values[nameof<Student>("firstName")],
                    values[nameof<Student>("lastName")],
                    values[nameof<Student>("isConfirmed")],
                    values[nameof<Student>("schoolId")],
                    values[nameof<Student>("educationId")],
                    this.props.studentToEdit !== undefined ? this.props.studentToEdit.isPlanned : false,
                    this.props.studentToEdit !== undefined ? this.props.studentToEdit.internship : undefined,
                );

                this.props.submitStudent(student)
                    .then(() => {
                        this.handleClose();
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
