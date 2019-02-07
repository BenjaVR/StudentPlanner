import { DatePicker, Form, InputNumber, Modal, Select } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import moment from "moment";
import React from "react";
import { isMomentDayAfterOtherDay } from "../../helpers/comparers";
import { nameof } from "../../helpers/nameof";
import { FormValidationTrigger } from "../../helpers/types";
import { Department } from "../../models/Department";
import { Internship } from "../../models/Internship";
import { Student } from "../../models/Student";

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
}

class PlanningsFormModal extends React.Component<PlanningsFormModalProps, IPlanningsFormModalState> {

    constructor(props: PlanningsFormModalProps) {
        super(props);

        this.state = {
            isSubmitting: false,
            formValidateTrigger: "",
        };

        this.renderDepartmentSelectOption = this.renderDepartmentSelectOption.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOk = this.handleOk.bind(this);
    }

    public componentDidUpdate(prevProps: PlanningsFormModalProps): void {
        if (this.props.isVisible === true
            && prevProps.isVisible === false
            && this.props.studentToPlan !== undefined
            && this.props.internshipToEdit !== undefined) {

            const internship = this.props.internshipToEdit;
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
            >
                <Form>
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
                            />,
                        )}
                    </FormItem>
                    <FormItem label="Eind datum">
                        {getFieldDecorator<Internship>("endDate", {
                            validateTrigger: this.state.formValidateTrigger,
                            validateFirst: true,
                            rules: [
                                { required: true, message: "Eind datum mag niet leeg zijn" },
                                {
                                    validator: (_, endDate: moment.Moment | undefined, callback) => {
                                        const startDate = this.props.form.getFieldValue(nameof<Internship>("startDate"));
                                        if (isMomentDayAfterOtherDay(endDate, startDate)) {
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
                            />,
                        )}
                    </FormItem>
                    <FormItem label="Stage uren">
                        {getFieldDecorator<Internship>("hours", {
                            validateTrigger: this.state.formValidateTrigger,
                            rules: [
                                { required: true, message: "Geef een aantal stage uren in" },
                            ],
                        })(
                            <InputNumber
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
}

const WrappedPlanningsFormModal = Form.create<PlanningsFormModalProps>()(PlanningsFormModal);
export default WrappedPlanningsFormModal;
