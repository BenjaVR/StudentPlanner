import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Tooltip } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import React from "react";
import { CirclePicker, ColorResult } from "react-color";
import { IDepartmentEducationCapacity } from "../../entities/IDepartment";
import { nameof } from "../../helpers/nameof";
import { FormValidationTrigger } from "../../helpers/types";
import { Department } from "../../models/Department";
import { Education } from "../../models/Education";
import styles from "./DepartmentsFormModal.module.scss";

interface IDepartmentFormModalProps {
    title: string;
    okText: string;
    isVisible: boolean;
    departmentToEdit: Department | undefined;
    educations: Education[];
    isEducationsLoading: boolean;
    onCloseRequest: () => void;
    submitDepartment(department: Department): Promise<void>;
}

type DepartmentFormModalProps = IDepartmentFormModalProps & FormComponentProps;

interface IDepartmentFormModalState {
    isSubmitting: boolean;
    formValidateTrigger: FormValidationTrigger;
    capacityFieldIds: number[];
    selectedColor: string | undefined;
}

class DepartmentFormModal extends React.Component<DepartmentFormModalProps, IDepartmentFormModalState> {

    private capacityKeysId = 0;
    private capacityPerEducationFieldName: keyof Department = "capacityPerEducation";
    private educationIdFieldName: keyof IDepartmentEducationCapacity = "educationId";
    private capacityFieldName: keyof IDepartmentEducationCapacity = "capacity";

    constructor(props: DepartmentFormModalProps) {
        super(props);

        this.state = {
            isSubmitting: false,
            formValidateTrigger: "",
            capacityFieldIds: [],
            selectedColor: undefined,
        };

        this.renderEducationSelectOption = this.renderEducationSelectOption.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
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
            const fields: Partial<Department> = {
                name: departmentToEdit.name,
                color: departmentToEdit.color,
            };
            this.setState({ selectedColor: departmentToEdit.color });
            this.props.form.setFieldsValue(fields);
            capacityFieldIds.forEach((capacityFieldId) => {
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
                <Row key={capacityFieldId} gutter={8} type="flex" justify="space-between" align="bottom">
                    <Col span={14}>
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
                    </Col>
                    <Col span={7}>
                        <FormItem label="Capaciteit">
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
                    </Col>
                    <Col span={3}>
                        <FormItem>
                            <Tooltip title="Verwijderen">
                                <Button
                                    icon="delete"
                                    type="danger"
                                    ghost={true}
                                    onClick={deleletCapacityFunc}
                                />
                            </Tooltip>
                        </FormItem>
                    </Col>
                </Row>
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
                        {getFieldDecorator<Department>("name", {
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
                    <FormItem label="Kleur">
                        {getFieldDecorator<Department>("color", {
                            validateTrigger: this.state.formValidateTrigger,
                            rules: [
                                { required: true, message: "Kies een kleur" },
                            ],
                        })(
                            <CirclePicker color={this.state.selectedColor} onChange={this.handleColorChange} />,
                        )}
                    </FormItem>

                    <h4>Capaciteit per opleiding</h4>
                    <p>Max. aantal studenten per opleiding voor deze afdeling</p>
                    {capacitiesFormItems}
                    <Button type="dashed" onClick={this.handleAddCapacityField} className={styles.fullWidthInputField}>
                        Voeg capaciteit toe
                    </Button>
                </Form>
            </Modal>
        );
    }

    private renderEducationSelectOption(education: Education): React.ReactNode {
        return (
            <Select.Option key={education.id} value={education.id}>{education.name}</Select.Option>
        );
    }

    private handleColorChange(color: ColorResult): void {
        this.setState({ selectedColor: color.hex });
    }

    private handleAfterClose(): void {
        this.setState({
            capacityFieldIds: [],
            selectedColor: undefined,
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

        const fields: Array<keyof Department> = ["name", "color", "capacityPerEducation"];
        this.props.form.validateFieldsAndScroll(fields, (errors, values) => {
            if (!errors) {
                this.setState({
                    isSubmitting: true,
                });

                const color = values[nameof<Department>("color")];
                const department = new Department(
                    values[nameof<Department>("name")],
                    color.hex === undefined ? color : color.hex,
                    values[nameof<Department>("capacityPerEducation")],
                );

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
