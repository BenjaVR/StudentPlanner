import { Button, Form, Icon, Input, InputNumber, Modal, Select } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import React from "react";
import { FormValidationTrigger } from "../../helpers/types";
import { IDepartment, IDepartmentEducationCapacity } from "../../models/Department";
import { IEducation } from "../../models/Education";
import styles from "./DepartmentsFormModal.module.scss";

interface IDepartmentFormModalProps {
    title: string;
    okText: string;
    isVisible: boolean;
    departmentToEdit: IDepartment | undefined;
    educations: IEducation[];
    isEducationsLoading: boolean;
    onCloseRequest: () => void;
    submitDepartment(department: IDepartment): Promise<void>;
}

type DepartmentFormModalProps = IDepartmentFormModalProps & FormComponentProps;

interface IDepartmentFormModalState {
    isSubmitting: boolean;
    formValidateTrigger: FormValidationTrigger;
    capacityFieldIds: number[];
}

class DepartmentFormModal extends React.Component<DepartmentFormModalProps, IDepartmentFormModalState> {

    private capacityKeysId = 0;
    private capacityPerEducationFieldName: keyof IDepartment = "capacityPerEducation";
    private educationIdFieldName: keyof IDepartmentEducationCapacity = "educationId";
    private capacityFieldName: keyof IDepartmentEducationCapacity = "capacity";

    constructor(props: DepartmentFormModalProps) {
        super(props);

        this.state = {
            isSubmitting: false,
            formValidateTrigger: "",
            capacityFieldIds: [],
        };

        this.renderEducationSelectOption = this.renderEducationSelectOption.bind(this);
        this.handleAfterClose = this.handleAfterClose.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleAddCapacityField = this.handleAddCapacityField.bind(this);
        this.handleDeleteCapacityField = this.handleDeleteCapacityField.bind(this);
    }

    public componentDidUpdate(prevProps: DepartmentFormModalProps): void {
        // Populate the form if it is just opened and if a department to edit is passed.
        if (this.props.departmentToEdit !== undefined
            && this.props.isVisible === true
            && prevProps.isVisible === false) {
            const { departmentToEdit } = this.props;
            const idCount = (departmentToEdit.capacityPerEducation || []).length;
            this.capacityKeysId = idCount;
            const capacityFieldIds = Array.from(new Array(idCount), (_, idx) => idx);
            this.setState({
                capacityFieldIds,
            });
            this.props.form.getFieldDecorator<IDepartment>("name", {
                initialValue: departmentToEdit.name,
            });
            capacityFieldIds.forEach((capacityFieldId) => {
                // TODO: extract this string interpolation thing to a central place (it's being used multiple times)
                this.props.form.getFieldDecorator(`${this.capacityPerEducationFieldName}[${capacityFieldId}].${this.educationIdFieldName}`, {
                    initialValue: departmentToEdit.capacityPerEducation[capacityFieldId].educationId,
                });
                this.props.form.getFieldDecorator(`${this.capacityPerEducationFieldName}[${capacityFieldId}].${this.capacityFieldName}`, {
                    initialValue: departmentToEdit.capacityPerEducation[capacityFieldId].capacity,
                });
            });
        }
    }

    public render(): React.ReactNode {
        const { getFieldDecorator } = this.props.form;

        const educationSelectOptions = this.props.educations.map(this.renderEducationSelectOption);

        const capacitiesFormItems = this.state.capacityFieldIds.map((capacityFieldId) => {
            const deleletCapacityFunc = () => this.handleDeleteCapacityField(capacityFieldId);
            return (
                <React.Fragment key={capacityFieldId}>
                    <FormItem label="Opleiding">
                        {getFieldDecorator(`${this.capacityPerEducationFieldName}[${capacityFieldId}].${this.educationIdFieldName}`, {
                            validateTrigger: this.state.formValidateTrigger,
                            rules: [
                                { required: true, message: "Kies een opleiding" },
                            ],
                        })(
                            <Select
                                autoFocus={true}
                                disabled={this.state.isSubmitting}
                                loading={this.props.isEducationsLoading}
                                allowClear={true}
                                showSearch={true}
                                filterOption={true}
                                optionFilterProp="children"
                            >
                                {educationSelectOptions}
                            </Select>,
                        )}
                    </FormItem>
                    <FormItem label="Max. aantal studenten (capaciteit)">
                        {getFieldDecorator(`${this.capacityPerEducationFieldName}[${capacityFieldId}].${this.capacityFieldName}`, {
                            validateTrigger: this.state.formValidateTrigger,
                            rules: [
                                { required: true, message: "Vul een capaciteit in" },
                            ],
                        })(
                            <InputNumber
                                className={styles.fullWidthInputField}
                                disabled={this.state.isSubmitting}
                                min={1}
                            />,
                        )}
                    </FormItem>
                    <Button
                        size="small"
                        icon="delete"
                        type="danger"
                        ghost={true}
                        onClick={deleletCapacityFunc}
                    />
                </React.Fragment>
            );
        });

        return (
            <Modal
                visible={this.props.isVisible}
                title={this.props.title}
                onCancel={this.handleClose}
                onOk={this.handleOk}
                okText={this.props.okText}
                confirmLoading={this.state.isSubmitting}
                destroyOnClose={true}
                afterClose={this.handleAfterClose}
            >
                <Form>
                    <FormItem label="Naam">
                        {getFieldDecorator<IDepartment>("name", {
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

                    <h4>Capaciteit per opleiding</h4>
                    {capacitiesFormItems}
                    <Button type="dashed" onClick={this.handleAddCapacityField} className={styles.fullWidthInputField}>
                        Voeg capaciteit toe
                    </Button>
                </Form>
            </Modal>
        );
    }

    private renderEducationSelectOption(education: IEducation): React.ReactNode {
        return (
            <Select.Option key={education.id} value={education.id}>{education.name}</Select.Option>
        );
    }

    private handleAfterClose(): void {
        this.setState({
            capacityFieldIds: [],
        });
    }

    private handleClose(): void {
        this.props.onCloseRequest();
    }

    private handleOk(): void {
        // Do real-time validation (while typing) only after the first submit.
        this.setState({
            formValidateTrigger: "onChange",
        });

        const fields: Array<keyof IDepartment> = ["name", "capacityPerEducation"];
        this.props.form.validateFieldsAndScroll(fields, (errors, values) => {
            if (!errors) {
                this.setState({
                    isSubmitting: true,
                });

                const department: IDepartment = {
                    ...values,
                };
                // Make sure there is an array, and no empty values are in it.
                department.capacityPerEducation = (department.capacityPerEducation || [])
                    .filter((c) => c !== undefined && c !== null);

                this.props.submitDepartment(department)
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

    private handleAddCapacityField(): void {
        this.setState({
            capacityFieldIds: this.state.capacityFieldIds.concat(this.capacityKeysId++),
        });
    }

    private handleDeleteCapacityField(id: number): void {
        this.setState({
            capacityFieldIds: this.state.capacityFieldIds.filter((fieldId) => fieldId !== id),
        });
    }
}

const WrappedDepartmentFormModal = Form.create<IDepartmentFormModalProps>()(DepartmentFormModal);
export default WrappedDepartmentFormModal;
