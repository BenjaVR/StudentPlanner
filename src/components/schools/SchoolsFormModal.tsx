import { Form, Input, Modal } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import React from "react";
import { nameof } from "../../helpers/nameof";
import { FormValidationTrigger } from "../../helpers/types";
import { School } from "../../models/School";

interface ISchoolsFormModalProps {
    title: string;
    okText: string;
    isVisible: boolean;
    schoolToEdit: School | undefined;
    onCloseRequest: () => void;
    submitSchool(school: School): Promise<void>;
}

type SchoolFormModalProps = ISchoolsFormModalProps & FormComponentProps;

interface ISchoolsFormModalState {
    isSubmitting: boolean;
    formValidateTrigger: FormValidationTrigger;
}

class SchoolsFormModal extends React.Component<SchoolFormModalProps, ISchoolsFormModalState> {

    constructor(props: SchoolFormModalProps) {
        super(props);

        this.state = {
            isSubmitting: false,
            formValidateTrigger: "",
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOk = this.handleOk.bind(this);
    }

    public componentDidUpdate(prevProps: SchoolFormModalProps): void {
        // Populate the form if it is just opened and if a school to edit is passed.
        if (this.props.schoolToEdit !== undefined
            && this.props.isVisible === true
            && prevProps.isVisible === false) {

            const schoolFields: Partial<School> = {
                name: this.props.schoolToEdit.name,
            };
            this.props.form.setFieldsValue(schoolFields);
        }
    }

    public render(): React.ReactNode {
        const { getFieldDecorator } = this.props.form;

        return (
            <div onKeyDown={this.handleKeyDown}>
                <Modal
                    visible={this.props.isVisible}
                    title={this.props.title}
                    onCancel={this.handleClose}
                    onOk={this.handleOk}
                    okText={this.props.okText}
                    confirmLoading={this.state.isSubmitting}
                    destroyOnClose={true}
                    maskClosable={false}
                >
                    <Form>
                        <FormItem label="Naam">
                            {getFieldDecorator<School>("name", {
                                validateTrigger: this.state.formValidateTrigger,
                                rules: [
                                    { required: true, message: "Naam mag niet leeg zijn" },
                                ],
                            })(
                                <Input
                                    autoFocus={true}
                                    disabled={this.state.isSubmitting}
                                />,
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }

    private handleKeyDown(event: React.KeyboardEvent): void {
        if (event.key === "Enter") {
            this.handleOk();
        }
    }

    private handleClose(): void {
        this.props.onCloseRequest();
    }

    private handleOk(): void {
        // Do real-time validation (while typing) only after the first submit.
        this.setState({
            formValidateTrigger: "onChange",
        });

        const fields: Array<keyof School> = ["name"];
        this.props.form.validateFieldsAndScroll(fields, (errors, values) => {
            if (!errors) {
                this.setState({
                    isSubmitting: true,
                });

                const school = new School(
                    values[nameof<School>("name")],
                );

                this.props.submitSchool(school)
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

const WrappedSchoolsFormModal = Form.create<ISchoolsFormModalProps>()(SchoolsFormModal);
export default WrappedSchoolsFormModal;
