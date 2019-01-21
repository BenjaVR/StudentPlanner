import { Form, Input, Modal } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import React from "react";
import { IEducation } from "studentplanner-functions/shared/contract/IEducation";
import { FormValidationTrigger } from "../../helpers/types";

interface IEducationFormModalProps {
    title: string;
    okText: string;
    isVisible: boolean;
    educationToEdit: IEducation | undefined;
    onCloseRequest: () => void;
    submitEducation(education: IEducation): Promise<void>;
}

type EducationFormModalProps = IEducationFormModalProps & FormComponentProps;

interface IEducationFormModalState {
    isSubmitting: boolean;
    formValidateTrigger: FormValidationTrigger;
}

class EducationFormModal extends React.Component<EducationFormModalProps, IEducationFormModalState> {

    constructor(props: EducationFormModalProps) {
        super(props);

        this.state = {
            isSubmitting: false,
            formValidateTrigger: "",
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleOk = this.handleOk.bind(this);
    }

    public componentDidUpdate(prevProps: EducationFormModalProps): void {
        // Populate the form if it is just opened and if a education to edit is passed.
        if (this.props.educationToEdit !== undefined
            && this.props.isVisible === true
            && prevProps.isVisible === false) {
            this.props.form.setFieldsValue({
                name: this.props.educationToEdit.name,
            });
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
                <Form>
                    <FormItem label="Naam">
                        {getFieldDecorator<IEducation>("name", {
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

        const fields: Array<keyof IEducation> = ["name"];
        this.props.form.validateFieldsAndScroll(fields, (errors, values) => {
            if (!errors) {
                this.setState({
                    isSubmitting: true,
                });

                const education: IEducation = {
                    ...values,
                };
                this.props.submitEducation(education)
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

const WrappedEducationFormModal = Form.create<IEducationFormModalProps>()(EducationFormModal);
export default WrappedEducationFormModal;