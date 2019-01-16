import { Form, Input, Modal } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import React from "react";
import { ISchool } from "studentplanner-functions/src/contract/ISchool";
import { FormValidationTrigger } from "../../helpers/types";

interface ISchoolsFormModalProps {
    title: string;
    okText: string;
    isVisible: boolean;
    schoolToEdit: ISchool | undefined;
    onCloseRequest: () => void;
    submitSchool(school: ISchool): Promise<void>;
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

        this.handleClose = this.handleClose.bind(this);
        this.handleOk = this.handleOk.bind(this);
    }

    public componentDidUpdate(prevProps: SchoolFormModalProps): void {
        // Populate the form if it is just opened and if a school to edit is passed.
        if (this.props.schoolToEdit !== undefined
            && this.props.isVisible === true
            && prevProps.isVisible === false) {
            this.props.form.setFieldsValue({
                name: this.props.schoolToEdit.name,
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
                        {getFieldDecorator<ISchool>("name", {
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

        const fields: Array<keyof ISchool> = ["name"];
        this.props.form.validateFieldsAndScroll(fields, (errors, values) => {
            if (!errors) {
                this.setState({
                    isSubmitting: true,
                });

                const school: ISchool = {
                    ...values,
                };
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
