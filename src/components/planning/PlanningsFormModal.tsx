import { Col, DatePicker, Form, InputNumber, Modal, Row, Select } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import moment from "moment";
import React from "react";
import { isMomentDayAfterOrTheSameAsOtherDay } from "../../helpers/comparers";
import { nameof } from "../../helpers/nameof";
import { FormValidationTrigger } from "../../helpers/types";
import { Department } from "../../models/Department";
import { Internship } from "../../models/Internship";
import { Student } from "../../models/Student";
import styles from "./PlanningsFormModal.module.scss";

interface IPlanningsFormModalProps {
    title: string;
    okText: string;
    isVisible: boolean;
    internshipToEdit: Internship | undefined;
    studentToPlan: Student | undefined;
    departments: Department[];
    areDepartmentsLoading: boolean;
    onCloseRequest: () => void;
    submitInternship(internship: Internship): Promise<void>;
}

type PlanningsFormModalProps = IPlanningsFormModalProps & FormComponentProps;

interface IPlanningsFormModalState {
    isSubmitting: boolean;
    formValidateTrigger: FormValidationTrigger;
    selectedStartDate: moment.Moment | null;
    selectedEndDate: moment.Moment | null;
}

class PlanningsFormModal extends React.Component<PlanningsFormModalProps, IPlanningsFormModalState> {

    constructor(props: PlanningsFormModalProps) {
        super(props);

        this.state = {
            isSubmitting: false,
            formValidateTrigger: "",
            selectedStartDate: null,
            selectedEndDate: null,
        };

        this.renderDepartmentSelectOption = this.renderDepartmentSelectOption.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleFormClosed = this.handleFormClosed.bind(this);
    }

    public componentDidUpdate(prevProps: PlanningsFormModalProps): void {
        if (this.props.isVisible === true
            && prevProps.isVisible === false
            && this.props.studentToPlan !== undefined
            && this.props.internshipToEdit !== undefined) {

            const internship = this.props.internshipToEdit;

            this.setState({
                selectedStartDate: internship.startDate || null,
                selectedEndDate: internship.endDate || null,
            });

            const internshipFields: Partial<Internship> = {
                hours: internship.hours,
                startDate: internship.startDate,
                endDate: internship.endDate,
                departmentId: internship.departmentId,
            };
            this.props.form.setFieldsValue(internshipFields);
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
                afterClose={this.handleFormClosed}
            >
                <Form>
                    <Row type="flex" align="middle" gutter={4}>
                        <Col span={10}>
                            <FormItem label="Start datum">
                                {getFieldDecorator<Internship>("startDate", {
                                    validateTrigger: this.state.formValidateTrigger,
                                    rules: [
                                        { required: true, message: "Start datum mag niet leeg zijn" },
                                    ],
                                })(
                                    <DatePicker
                                        allowClear={true}
                                        disabled={this.state.isSubmitting}
                                        onChange={this.handleStartDateChange}
                                    />,
                                )}
                            </FormItem>
                        </Col>
                        <Col span={10}>
                            <FormItem label="Eind datum">
                                {getFieldDecorator<Internship>("endDate", {
                                    validateTrigger: this.state.formValidateTrigger,
                                    validateFirst: true,
                                    rules: [
                                        { required: true, message: "Eind datum mag niet leeg zijn" },
                                        {
                                            validator: (_, endDate: moment.Moment | undefined, callback) => {
                                                const startDate = this.props.form.getFieldValue(nameof<Internship>("startDate"));
                                                if (isMomentDayAfterOrTheSameAsOtherDay(endDate, startDate)) {
                                                    return callback();
                                                }
                                                return callback(false);
                                            },
                                            message: "Eind datum moet na start datum liggen",
                                        },
                                    ],
                                })(
                                    <DatePicker
                                        allowClear={true}
                                        disabled={this.state.isSubmitting}
                                        onChange={this.handleEndDateChange}
                                    />,
                                )}
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <p className={styles.amountOfDaysText}>{this.state.selectedStartDate !== null && this.state.selectedEndDate !== null &&
                                `${this.state.selectedEndDate.diff(this.state.selectedStartDate, "days") + 1} dag(en)` // +1 to include both start and end date.
                            }</p>
                        </Col>
                    </Row>
                    <FormItem label="Stage uren">
                        {getFieldDecorator<Internship>("hours", {
                            validateTrigger: this.state.formValidateTrigger,
                            rules: [
                                { required: true, message: "Geef een aantal stage uren in" },
                            ],
                        })(
                            <InputNumber
                                style={{ width: "100%" }}
                                disabled={this.state.isSubmitting}
                                min={0}
                            />,
                        )}
                    </FormItem>
                    <FormItem label="Afdeling">
                        {getFieldDecorator<Internship>("departmentId", {
                            validateTrigger: this.state.formValidateTrigger,
                            rules: [
                                {
                                    required: true,
                                    validator: (_, departmentId, callback) => {
                                        if (departmentId === undefined || departmentId === "") {
                                            callback(false);
                                        }
                                        callback();
                                    },
                                    message: "Kies een afdeling",
                                },
                            ],
                        })(
                            <Select
                                disabled={this.state.isSubmitting}
                                loading={this.props.areDepartmentsLoading}
                                allowClear={true}
                                showSearch={true}
                                filterOption={true}
                                optionFilterProp="children"
                            >
                                {this.props.departments.map(this.renderDepartmentSelectOption)}
                            </Select>,
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }

    private renderDepartmentSelectOption(department: Department): React.ReactNode {
        return (
            <Select.Option key={department.id} value={department.id}>{department.name}</Select.Option>
        );
    }

    private handleStartDateChange(date: moment.Moment, _: string): void {
        this.setState({ selectedStartDate: date });
    }

    private handleEndDateChange(date: moment.Moment, _: string): void {
        this.setState({ selectedEndDate: date });
    }

    private handleClose(): void {
        this.props.onCloseRequest();
    }

    private handleOk(): void {
        // Do real-time validation (while typing) only after the first submit.
        this.setState({
            formValidateTrigger: "onChange",
        });

        const fields: Array<keyof Internship> = ["startDate", "endDate", "hours", "departmentId"];
        this.props.form.validateFieldsAndScroll(fields, (errors, values) => {
            if (!errors) {
                this.setState({
                    isSubmitting: true,
                });

                const internship = new Internship(
                    values[nameof<Internship>("startDate")] as moment.Moment,
                    values[nameof<Internship>("endDate")] as moment.Moment,
                    values[nameof<Internship>("hours")] as number,
                    false,
                    this.props.studentToPlan!.id!,
                    values[nameof<Internship>("departmentId") as string],
                );

                this.props.submitInternship(internship)
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

    private handleFormClosed(): void {
        this.setState({
            selectedStartDate: null,
            selectedEndDate: null,
        });
    }
}

const WrappedPlanningsFormModal = Form.create<PlanningsFormModalProps>()(PlanningsFormModal);
export default WrappedPlanningsFormModal;
