import { Col, DatePicker, Form, InputNumber, Modal, notification, Row, Select } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import moment from "moment";
import React from "react";
import { isMomentDayAfterOrTheSameAsOtherDay } from "../../helpers/comparers";
import { studentsPlannedFullyInRange, studentsPlannedInDay, studentsPlannedPartiallyInRange } from "../../helpers/filters";
import { nameof } from "../../helpers/nameof";
import { FormValidationTrigger } from "../../helpers/types";
import { Department } from "../../models/Department";
import { Education } from "../../models/Education";
import { IStudentInternship, Student } from "../../models/Student";
import { StudentsRepository } from "../../services/repositories/StudentsRepository";
import styles from "./PlanningsFormModal.module.scss";

interface IPlanningsFormModalProps {
    title: string;
    okText: string;
    isVisible: boolean;
    studentToPlan: Student | undefined;
    departments: Department[];
    areDepartmentsLoading: boolean;
    isEdit: boolean;
    educations: Education[];
    onCloseRequest: () => void;
    submitInternship(internship: IStudentInternship): Promise<void>;
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
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleFormClosed = this.handleFormClosed.bind(this);
    }

    public componentDidUpdate(prevProps: PlanningsFormModalProps): void {
        if (this.props.isVisible === true
            && prevProps.isVisible === false
            && this.props.studentToPlan !== undefined) {

            const internship = this.props.studentToPlan.internship;
            if (internship === undefined) {
                return;
            }

            this.setState({
                selectedStartDate: internship.startDate || null,
                selectedEndDate: internship.endDate || null,
            });

            const internshipFields: Partial<IStudentInternship> = {
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
                    afterClose={this.handleFormClosed}
                >
                    <Form onKeyDown={this.handleKeyDown}>
                        <Row type="flex" align="middle" gutter={4}>
                            <Col span={10}>
                                <FormItem label="Start datum">
                                    {getFieldDecorator<IStudentInternship>("startDate", {
                                        validateTrigger: this.state.formValidateTrigger,
                                        rules: [
                                            { required: true, message: "Start datum mag niet leeg zijn" },
                                        ],
                                    })(
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            allowClear={true}
                                            disabled={this.state.isSubmitting}
                                            onChange={this.handleStartDateChange}
                                        />,
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem label="Eind datum">
                                    {getFieldDecorator<IStudentInternship>("endDate", {
                                        validateTrigger: this.state.formValidateTrigger,
                                        validateFirst: true,
                                        rules: [
                                            { required: true, message: "Eind datum mag niet leeg zijn" },
                                            {
                                                validator: (_, endDate: moment.Moment | undefined, callback) => {
                                                    const startDate = this.props.form.getFieldValue(nameof<IStudentInternship>("startDate"));
                                                    if (isMomentDayAfterOrTheSameAsOtherDay(endDate, startDate)) {
                                                        return callback();
                                                    }
                                                    return callback(false);
                                                },
                                                message: "Eind datum mag niet voor de start datum liggen",
                                            },
                                        ],
                                    })(
                                        <DatePicker
                                            format="DD/MM/YYYY"
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
                            {getFieldDecorator<IStudentInternship>("hours", {
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
                            {getFieldDecorator<IStudentInternship>("departmentId", {
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
            </div>
        );
    }

    private renderDepartmentSelectOption(department: Department): React.ReactNode {
        return (
            <Select.Option key={department.id} value={department.id}>{department.name}</Select.Option>
        );
    }

    private handleKeyDown(event: React.KeyboardEvent): void {
        if (event.key === "Enter") {
            this.handleOk();
        }
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

        const fields: Array<keyof IStudentInternship> = ["startDate", "endDate", "hours", "departmentId"];
        this.props.form.validateFieldsAndScroll(fields, (errors, values) => {
            if (!errors) {
                const internship: IStudentInternship = {
                    startDate: values[nameof<IStudentInternship>("startDate")] as moment.Moment,
                    endDate: values[nameof<IStudentInternship>("endDate")] as moment.Moment,
                    hours: values[nameof<IStudentInternship>("hours")] as number,
                    departmentId: values[nameof<IStudentInternship>("departmentId") as string],
                };

                const department = this.props.departments.find((dep) => dep.id === internship.departmentId);
                if (department === undefined) {
                    notification.warning({
                        message: "Er ging iets fout, probeer later opnieuw",
                    });
                    return;
                }

                this.setState({
                    isSubmitting: true,
                });
                StudentsRepository.getPlannedStudentsWithDepartment(department)
                    .then((studentsWithDepartment) => {
                        const students = studentsPlannedFullyInRange(studentsWithDepartment, internship.startDate, internship.endDate)
                            .concat(studentsPlannedPartiallyInRange(studentsWithDepartment, internship.startDate, internship.endDate))
                            .filter((student) => {
                                if (this.props.isEdit === false || this.props.studentToPlan === undefined) {
                                    return true;
                                }
                                return student.id !== this.props.studentToPlan.id;
                            });

                        const education = this.props.educations.find((edu) => this.props.studentToPlan !== undefined && edu.id === this.props.studentToPlan.educationId);
                        const isCrossingTheCapacityLimits = education === undefined
                            ? false
                            : department.getCapacityForEducation(education) <= department.getUsedCapacityForEducation(students, education);

                        if (isCrossingTheCapacityLimits && education !== undefined) {
                            const intersectingDates: moment.Moment[] = [];
                            for (const m = moment(internship.startDate); m.diff(internship.endDate, "days") <= 0; m.add(1, "day")) {
                                if (department.totalCapacity <= department.getUsedCapacityForEducation(studentsPlannedInDay(students, m), education)) {
                                    intersectingDates.push(moment(m));
                                }
                            }
                            Modal.confirm({
                                title: "Capaciteit overschreden",
                                content: (
                                    <React.Fragment>
                                        <p>Er is minstens één geselecteerde dag waar de capaciteit voor <b>{department.name}</b> (opleiding <b>{education.name}</b>) werd overschreden.</p>
                                        <p>Bent u zeker dat u wilt verdergaan?</p>
                                        <ul>
                                            {intersectingDates.map((intersectingDate) => {
                                                return <li key={intersectingDate.unix()}>{intersectingDate.format("DD MMMM YYYY")}</li>;
                                            })}
                                        </ul>
                                    </React.Fragment>
                                ),
                                cancelText: "Terugkeren",
                                onCancel: () => {
                                    this.setState({
                                        isSubmitting: false,
                                    });
                                },
                                okText: "Toch toevoegen",
                                onOk: () => {
                                    this.doSubmit(internship);
                                },
                            });
                        } else {
                            this.doSubmit(internship);
                        }
                    })
                    .catch(() => {
                        notification.warning({
                            message: "Er ging iets fout, probeer later opnieuw",
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

    private async doSubmit(internship: IStudentInternship): Promise<void> {
        return this.props.submitInternship(internship)
            .then(() => {
                this.handleClose();
            })
            .finally(() => {
                this.setState({
                    isSubmitting: false,
                });
            });
    }
}

const WrappedPlanningsFormModal = Form.create<PlanningsFormModalProps>()(PlanningsFormModal);
export default WrappedPlanningsFormModal;
