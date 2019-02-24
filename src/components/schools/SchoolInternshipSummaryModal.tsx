import { Card, Col, DatePicker, Form, Icon, List, Modal, Row, Spin, Tooltip } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import moment from "moment";
import React from "react";
import { isMomentDayAfterOrTheSameAsOtherDay } from "../../helpers/comparers";
import { nameof } from "../../helpers/nameof";
import { Department } from "../../models/Department";
import { Education } from "../../models/Education";
import { School } from "../../models/School";
import { Student } from "../../models/Student";
import { StudentsRepository } from "../../services/repositories/StudentsRepository";

interface ISchoolInternshipSummaryModalProps {
    isVisible: boolean;
    educations: Education[];
    departments: Department[];
    selectedSchool: School | undefined;
    handleClose: () => void;
}

type SchoolInternshipSummaryModalProps = ISchoolInternshipSummaryModalProps & FormComponentProps;

interface ISchoolInternshipSummaryModalState {
    studentsWithInternship: Student[];
    areStudentsLoading: boolean;
    selectedStartDate: moment.Moment | undefined;
    selectedEndDate: moment.Moment | undefined;
}

class SchoolInternshipSummaryModal extends React.Component<SchoolInternshipSummaryModalProps, ISchoolInternshipSummaryModalState> {

    constructor(props: SchoolInternshipSummaryModalProps) {
        super(props);

        this.state = {
            studentsWithInternship: [],
            areStudentsLoading: false,
            selectedStartDate: undefined,
            selectedEndDate: undefined,
        };

        this.renderStudentsFullyInPeriod = this.renderStudentsFullyInPeriod.bind(this);
        this.renderStudentsNotFullyInPeriod = this.renderStudentsNotFullyInPeriod.bind(this);
        this.renderStudentFullyInPeriod = this.renderStudentFullyInPeriod.bind(this);
        this.renderStudentNotFullyInPeriod = this.renderStudentNotFullyInPeriod.bind(this);
        this.renderHoursInformationalTooltip = this.renderHoursInformationalTooltip.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleDateChanged = this.handleDateChanged.bind(this);
    }

    public componentWillReceiveProps(nextProps: SchoolInternshipSummaryModalProps): void {
        if (nextProps.isVisible && !this.props.isVisible) {
            this.setState({
                studentsWithInternship: [],
                areStudentsLoading: false,
            });

            // Remember the last searched date, to be able to quickly check the same period for multiple schools.
            if (this.state.selectedStartDate !== undefined && this.state.selectedEndDate) {
                this.props.form.getFieldDecorator(nameof<ISchoolInternshipSummaryModalState>("selectedStartDate"), { initialValue: this.state.selectedStartDate });
                this.props.form.getFieldDecorator(nameof<ISchoolInternshipSummaryModalState>("selectedEndDate"), { initialValue: this.state.selectedEndDate });
            }

            if (nextProps.selectedSchool !== undefined) {
                this.setState({ areStudentsLoading: true });
                StudentsRepository.getPlannedStudentsForSchool(nextProps.selectedSchool)
                    .then((students) => {
                        this.setState({
                            studentsWithInternship: students,
                            areStudentsLoading: false,
                        });
                    });
            }
        }
    }

    public render(): React.ReactNode {
        const studentsFullyInPeriod = this.state.studentsWithInternship.filter((student) => {
            return this.state.selectedStartDate !== undefined && this.state.selectedEndDate !== undefined && student.internship !== undefined
                && student.internship.startDate.isSameOrAfter(this.state.selectedStartDate)
                && student.internship.endDate.isSameOrBefore(this.state.selectedEndDate);
        });
        const studentsNotFullyInPeriod = this.state.studentsWithInternship.filter((student) => {
            return this.state.selectedStartDate !== undefined && this.state.selectedEndDate !== undefined && student.internship !== undefined
                && ((student.internship.startDate.isBefore(this.state.selectedStartDate) && student.internship.endDate.isSameOrAfter(this.state.selectedStartDate))
                    || (student.internship.endDate.isAfter(this.state.selectedEndDate) && student.internship.startDate.isSameOrBefore(this.state.selectedEndDate)));
        });

        const totalStudentsCount = studentsFullyInPeriod.length + studentsNotFullyInPeriod.length;
        const totalInternshipDaysCount = [...studentsFullyInPeriod, ...studentsNotFullyInPeriod]
            .map((student) => student.getInternshipNumberOfDaysInRange(this.state.selectedStartDate, this.state.selectedEndDate))
            .reduce((sum, days) => sum + days, 0);

        const totalInternshipHoursCount = [...studentsFullyInPeriod, ...studentsNotFullyInPeriod]
            .map((student) => student.getInternshipNumberOfHoursInRange(this.state.selectedStartDate, this.state.selectedEndDate))
            .reduce((sum, hours) => sum + hours, 0);

        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                title={`Stages voor ${this.props.selectedSchool !== undefined ? this.props.selectedSchool.name : ""}`}
                visible={this.props.isVisible}
                footer={null}
                closable={true}
                maskClosable={true}
                onCancel={this.handleClose}
                destroyOnClose={true}
                width={700}
            >
                <Spin spinning={this.state.areStudentsLoading}>
                    <b>Selecteer stages tussen volgende datums:</b>
                    <Form>
                        <Row type="flex" align="bottom" gutter={4} justify="space-between">
                            <Col span={12}>
                                <FormItem label="Van">
                                    {getFieldDecorator<ISchoolInternshipSummaryModalState>("selectedStartDate")(
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            style={{ width: "100%" }}
                                            allowClear={true}
                                            onChange={this.handleStartDateChange}
                                        />,
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="Tot en met">
                                    {getFieldDecorator<ISchoolInternshipSummaryModalState>("selectedEndDate", {
                                        validateTrigger: "",
                                        rules: [
                                            {
                                                validator: (_, endDate: moment.Moment | null, callback) => {
                                                    const startDate = this.props.form.getFieldValue(nameof<ISchoolInternshipSummaryModalState>("selectedStartDate"));
                                                    if (isMomentDayAfterOrTheSameAsOtherDay(endDate || undefined, startDate)) {
                                                        return callback();
                                                    }
                                                    return callback(false);
                                                },
                                                message: "Deze datum mag niet eerder dan de \"van\" datum zijn",
                                            },
                                        ],
                                    })(
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            style={{ width: "100%" }}
                                            allowClear={true}
                                            onChange={this.handleEndDateChange}
                                        />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    {this.state.selectedStartDate !== undefined && this.state.selectedEndDate !== undefined && this.state.selectedEndDate.isSameOrAfter(this.state.selectedStartDate) &&
                        <React.Fragment>
                            <Card>
                                <p>
                                    <b>Totalen voor geselecteerde periode</b>:
                                </p>
                                <p>
                                    <b>{totalStudentsCount}</b> {totalStudentsCount === 1 ? "student" : "studenten"},&nbsp;
                                    <b>{totalInternshipDaysCount}</b> {totalInternshipDaysCount === 1 ? "stage dag" : "stage dagen"},&nbsp;
                                    <b>{totalInternshipHoursCount}</b> {totalInternshipHoursCount === 1 ? "stage uur" : "stage uren "}
                                    <Tooltip title={this.renderHoursInformationalTooltip()} mouseEnterDelay={0.5}>
                                        <Icon type="question-circle" />
                                    </Tooltip>
                                </p>
                            </Card>
                            <br />
                            <Card>
                                {this.renderStudentsFullyInPeriod(studentsFullyInPeriod)}
                                <br />
                                {this.renderStudentsNotFullyInPeriod(studentsNotFullyInPeriod)}
                            </Card>
                        </React.Fragment>
                    }
                </Spin>
            </Modal>
        );
    }

    private renderStudentsFullyInPeriod(students: Student[]): React.ReactNode {
        return (
            <List
                bordered={true}
                header={<b>Stages volledig binnen geselecteerde periode</b>}
                locale={{ emptyText: "Geen stages gevonden" }}
                dataSource={students}
                pagination={undefined}
                renderItem={this.renderStudentFullyInPeriod}
            />
        );
    }

    private renderStudentsNotFullyInPeriod(students: Student[]): React.ReactNode {
        return (
            <List
                bordered={true}
                header={<b>Stages gedeeltelijk binnen geselecteerde periode</b>}
                locale={{ emptyText: "Geen stages gevonden" }}
                dataSource={students}
                pagination={undefined}
                renderItem={this.renderStudentNotFullyInPeriod}
            />
        );
    }

    private renderStudentFullyInPeriod(student: Student): React.ReactNode {
        const internshipDays = student.getInternshipNumberOfDaysInRange(this.state.selectedStartDate, this.state.selectedEndDate);
        const internshipHours = student.getInternshipNumberOfHoursInRange(this.state.selectedStartDate, this.state.selectedEndDate);
        return (
            <List.Item>
                <Row type="flex" align="middle" justify="space-between" style={{ width: "100%" }}>
                    <Col span={8} style={{ textAlign: "left" }}>
                        {student.fullName}
                    </Col>
                    <Col span={8} style={{ textAlign: "center" }}>
                        {student.internship!.startDate.format("DD/MM/YY")} - {student.internship!.endDate.format("DD/MM/YY")}
                    </Col>
                    <Col span={8} style={{ textAlign: "right" }}>
                        <b>{internshipDays}</b> {internshipDays === 1 ? "dag" : "dagen"}
                        &nbsp;
                        (<b>{internshipHours}</b> {internshipHours === 1 ? "uur" : "uren"})
                    </Col>
                </Row>
            </List.Item>
        );
    }

    private renderStudentNotFullyInPeriod(student: Student): React.ReactNode {
        const internshipDays = student.getInternshipNumberOfDaysInRange(this.state.selectedStartDate, this.state.selectedEndDate);
        const internshipHours = student.getInternshipNumberOfHoursInRange(this.state.selectedStartDate, this.state.selectedEndDate);
        return (
            <List.Item>
                <Row type="flex" align="middle" justify="space-between" style={{ width: "100%" }}>
                    <Col span={8} style={{ textAlign: "left" }}>
                        {student.fullName}
                    </Col>
                    <Col span={8} style={{ textAlign: "center" }}>
                        {student.internship!.startDate.format("DD/MM/YY")} - {student.internship!.endDate.format("DD/MM/YY")}
                    </Col>
                    <Col span={8} style={{ textAlign: "right" }}>
                        <b>{internshipDays}</b>/{student.internshipNumberOfDays} {internshipDays === 1 ? "dag" : "dagen"}
                        &nbsp;
                        (<b>{internshipHours}</b>/{student.internship!.hours} {internshipHours === 1 ? "uur" : "uren"})
                    </Col>
                </Row>
            </List.Item>
        );
    }

    private renderHoursInformationalTooltip(): React.ReactNode {
        return (
            <i>
                Voor studenten die gedeeltelijk in de geselecteerde periode zitten, werden niet alle ingegeven uren meegeteld!
                Stel een stage van 10 dagen (50 uren in totaal) die voor 5 dagen in de gekozen periode zit, dan zal deze maar voor 25 uren worden meegeteld.
            </i>
        );
    }

    private handleStartDateChange(newDate: moment.Moment | null): void {
        const newStartDate = newDate || undefined;
        this.setState({ selectedStartDate: newStartDate }, () => this.handleDateChanged());
    }

    private handleEndDateChange(newDate: moment.Moment | null): void {
        const newEndDate = newDate || undefined;
        this.setState({ selectedEndDate: newEndDate }, () => this.handleDateChanged());
    }

    private handleDateChanged(): void {
        if (this.state.selectedStartDate === undefined || this.state.selectedEndDate === undefined || this.state.selectedStartDate.isSameOrBefore(this.state.selectedEndDate)) {
            // Reset validation messages
            this.props.form.setFields({
                [nameof<ISchoolInternshipSummaryModalState>("selectedStartDate")]: {
                    value: this.props.form.getFieldValue(nameof<ISchoolInternshipSummaryModalState>("selectedStartDate")),
                    errors: undefined,
                },
                [nameof<ISchoolInternshipSummaryModalState>("selectedEndDate")]: {
                    value: this.props.form.getFieldValue(nameof<ISchoolInternshipSummaryModalState>("selectedEndDate")),
                    errors: undefined,
                },
            });
        } else {
            // Validate input
            this.props.form.validateFieldsAndScroll([nameof<ISchoolInternshipSummaryModalState>("selectedStartDate"), nameof<ISchoolInternshipSummaryModalState>("selectedEndDate")]);
        }
    }

    private handleClose(): void {
        this.props.handleClose();
    }
}

const WrappedSchoolInternshipSummaryModal = Form.create<SchoolInternshipSummaryModalProps>()(SchoolInternshipSummaryModal);
export default WrappedSchoolInternshipSummaryModal;
