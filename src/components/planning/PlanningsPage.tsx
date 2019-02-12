import { Button, Calendar, Col, List, Modal, notification, Row, Spin, Tag, Tooltip, Popover } from "antd";
import classNames from "classnames";
import moment from "moment";
import React from "react";
import { studentsPlannedInDay } from "../../helpers/filters";
import { Department } from "../../models/Department";
import { Education } from "../../models/Education";
import { IStudentInternship, Student } from "../../models/Student";
import { AnyRouteComponentProps } from "../../routes";
import { DepartmentsRepository } from "../../services/repositories/DepartmentsRepository";
import { EducationsRepository } from "../../services/repositories/EducationsRepository";
import { StudentsRepository } from "../../services/repositories/StudentsRepository";
import PlanningDetailsModal from "./PlanningDetailsModal";
import PlanningsFormModal from "./PlanningsFormModal";
import styles from "./PlanningsPage.module.scss";

type PlanningsPageProps = AnyRouteComponentProps;

interface IPlanningsPageState {
    plannedStudents: Student[];
    plannedStudentToEdit: Student | undefined;
    arePlannedStudentsLoading: boolean;
    unplannedStudents: Student[];
    areStudentsLoading: boolean;
    selectedStudentToPlan: Student | undefined;
    showOnlyConfirmedStudents: boolean;
    isCalendarLoading: boolean;
    isAddInternshipModalVisible: boolean;
    departments: Department[];
    areDepartmentsLoading: boolean;
    educations: Education[];
    areEducationsLoading: boolean;
    isPlanningsDetailVisible: boolean;
    studentsForPlanningsDetail: Student[];
    selectedDateForPlanningDetail: moment.Moment | undefined;
}

class PlanningsPage extends React.Component<PlanningsPageProps, IPlanningsPageState> {

    private calendarRef: Calendar | null = null;
    private unsubscribeFromPlannedStudents: () => void;

    private readonly studentLoadFailedNotificationKey = "studentLoadFailed";
    private readonly departmentLoadFailedNotificationKey = "departmentLoadFailed";
    private readonly educationLoadFailedNotificationKey = "educationLoadFailed";

    constructor(props: PlanningsPageProps) {
        super(props);

        this.state = {
            plannedStudents: [],
            plannedStudentToEdit: undefined,
            arePlannedStudentsLoading: true,
            unplannedStudents: [],
            areStudentsLoading: false,
            selectedStudentToPlan: undefined,
            showOnlyConfirmedStudents: true,
            isCalendarLoading: false,
            isAddInternshipModalVisible: false,
            departments: [],
            areDepartmentsLoading: false,
            educations: [],
            areEducationsLoading: false,
            isPlanningsDetailVisible: false,
            studentsForPlanningsDetail: [],
            selectedDateForPlanningDetail: undefined,
        };

        this.unsubscribeFromPlannedStudents = () => { return; };

        this.renderStudentListHeader = this.renderStudentListHeader.bind(this);
        this.renderStudentListItem = this.renderStudentListItem.bind(this);
        this.renderDateCell = this.renderDateCell.bind(this);
        this.handlePlanningsDetailClose = this.handlePlanningsDetailClose.bind(this);
        this.handleDateCellSelect = this.handleDateCellSelect.bind(this);
        this.handleReloadStudents = this.handleReloadStudents.bind(this);
        this.handleNextMonth = this.handleNextMonth.bind(this);
        this.handlePrevMonth = this.handlePrevMonth.bind(this);
        this.addInternshipForStudent = this.addInternshipForStudent.bind(this);
        this.closeAddInternshipModal = this.closeAddInternshipModal.bind(this);
    }

    public componentDidMount(): void {
        this.unsubscribeFromPlannedStudents = StudentsRepository.subscribeToPlannedStudents((students) => {
            this.setState({
                arePlannedStudentsLoading: false,
                plannedStudents: students,
            });
        });
        this.loadNotPlannedStudents();
        this.loadDepartments();
        this.loadEducations();
    }

    public componentWillUnmount(): void {
        this.unsubscribeFromPlannedStudents();
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <Row type="flex">
                    <Col span={24} xl={16} xxl={18}>
                        <Spin spinning={this.state.isCalendarLoading}>
                            <div className={styles.buttonsInCalendarComponent}>
                                <Button icon="left" onClick={this.handlePrevMonth} />
                                <Button icon="right" onClick={this.handleNextMonth} />
                            </div>
                            <Spin spinning={this.state.arePlannedStudentsLoading}>
                                <Calendar
                                    mode="month"
                                    ref={(ref) => this.calendarRef = ref}
                                    dateCellRender={this.renderDateCell}
                                    onSelect={this.handleDateCellSelect}
                                />
                            </Spin>
                        </Spin>
                    </Col>
                    <Col span={24} xl={8} xxl={6}>
                        <List
                            dataSource={this.state.unplannedStudents}
                            header={this.renderStudentListHeader()}
                            renderItem={this.renderStudentListItem}
                            loading={this.state.areStudentsLoading}
                            bordered={true}
                            pagination={{ position: "bottom" }}
                        />
                    </Col>
                </Row>
                <PlanningsFormModal
                    title={this.state.selectedStudentToPlan === undefined
                        ? "Nieuwe stage toevoegen"
                        : `Nieuwe stage toevoegen voor ${this.state.selectedStudentToPlan.fullName}`}
                    okText="Voeg toe"
                    isVisible={this.state.isAddInternshipModalVisible}
                    submitInternship={this.addInternshipForStudent}
                    onCloseRequest={this.closeAddInternshipModal}
                    studentToPlan={this.state.selectedStudentToPlan}
                    departments={this.state.departments}
                    areDepartmentsLoading={this.state.areDepartmentsLoading}
                />
                <PlanningDetailsModal
                    departments={this.state.departments}
                    educations={this.state.educations}
                    students={this.state.plannedStudents}
                    selectedDate={this.state.selectedDateForPlanningDetail}
                    isVisible={this.state.isPlanningsDetailVisible}
                    onCloseRequested={this.handlePlanningsDetailClose}
                />
            </React.Fragment>
        );
    }

    private renderStudentListHeader(): React.ReactNode {
        return (
            <Row type="flex" justify="space-between">
                <Col>
                    <h2>In te plannen studenten</h2>
                </Col>
                <Col>
                    <Tooltip title="Vernieuw de lijst" placement="bottomRight">
                        <Button
                            icon="reload"
                            type="ghost"
                            onClick={this.handleReloadStudents}
                        />
                    </Tooltip>
                </Col>
            </Row>
        );
    }

    private renderStudentListItem(student: Student): React.ReactNode {
        const onListItemClickFn = () => this.handlePlanStudent(student);
        return (
            <List.Item actions={[<a key={0} onClick={onListItemClickFn}>Inplannen</a>]}>
                {student.fullName}
                &nbsp;
                {!student.isConfirmed &&
                    <Tag className={styles.notClickableTag} color="volcano">Niet bevestigd</Tag>
                }
            </List.Item>
        );
    }

    private renderDateCell(date: moment.Moment): React.ReactNode {
        const plannedStudentsToday = studentsPlannedInDay(this.state.plannedStudents, date);
        const departmentsRows = this.state.departments.map((department) => {
            const usedCapacity = plannedStudentsToday.filter((student) => {
                return student.internship !== undefined
                    && student.internship.departmentId === department.id;
            }).length;
            const totalCapacity = department.totalCapacity;
            return (
                <div key={department.id} className={styles.calendarTagContainer}>
                    <Tag
                        color={department.color}
                        style={{ border: `2px solid ${department.color}` }}
                        className={classNames(styles.notClickableTag, styles.calendarTag, { [styles.calendarTagOutline]: usedCapacity < totalCapacity })}
                    />
                    <span className={styles.calendarTagText}>{usedCapacity} / {totalCapacity}</span>
                </div>
            );
        });
        return (
            <React.Fragment>
                {departmentsRows}
            </React.Fragment>
        );
    }

    private handlePlanningsDetailClose(): void {
        this.setState({
            isPlanningsDetailVisible: false,
        });
    }

    private handleDateCellSelect(date: moment.Moment | undefined): void {
        if (date === undefined) {
            return;
        }
        this.setState({
            isPlanningsDetailVisible: true,
            studentsForPlanningsDetail: studentsPlannedInDay(this.state.plannedStudents, date),
            selectedDateForPlanningDetail: date,
        });
    }

    private handleReloadStudents(): void {
        this.loadNotPlannedStudents();
    }

    private handlePlanStudent(student: Student): void {
        this.openAddInternshipModal(student);
    }

    private handleNextMonth(): void {
        this.doMonthChange("next");
    }

    private handlePrevMonth(): void {
        this.doMonthChange("prev");
    }

    private openAddInternshipModal(student: Student): void {
        this.setState({
            selectedStudentToPlan: student,
            isAddInternshipModalVisible: true,
        });
    }

    private closeAddInternshipModal(): void {
        this.setState({ isAddInternshipModalVisible: false });
    }

    private addInternshipForStudent(internship: IStudentInternship): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            if (this.state.selectedStudentToPlan === undefined) {
                return reject("No student selected");
            }
            StudentsRepository.addInternshipForStudent(internship, this.state.selectedStudentToPlan)
                .then(() => {
                    notification.success({
                        message: "Stage succesvol toegevoegd",
                    });
                    this.loadNotPlannedStudents();
                    return resolve();
                })
                .catch((error) => {
                    notification.error({
                        message: "Kon stage niet toevoegen",
                    });
                    return reject(error);
                });
        });
    }

    private doMonthChange(action: "next" | "prev"): void {
        if (this.calendarRef === null) {
            return;
        }

        const currentMoment = this.calendarRef.state.value;

        if (action === "next") {
            this.calendarRef.setValue(currentMoment.add(1, "month"), "changePanel");
        }
        if (action === "prev") {
            this.calendarRef.setValue(currentMoment.subtract(1, "month"), "changePanel");
        }
    }

    private loadNotPlannedStudents(): void {
        this.setState({ areStudentsLoading: true });
        StudentsRepository.getNotPlannedStudents()
            .then((students) => {
                this.setState({ unplannedStudents: students });
                notification.close(this.studentLoadFailedNotificationKey);
            })
            .catch(() => {
                notification.error({
                    key: this.studentLoadFailedNotificationKey,
                    message: "Kon de studenten niet ophalen. Probeer later opnieuw.",
                    duration: null,
                });
            })
            .finally(() => {
                this.setState({ areStudentsLoading: false });
            });
    }

    private loadDepartments(): void {
        this.setState({ areDepartmentsLoading: true });
        DepartmentsRepository.getDepartmentsByName()
            .then((departments) => {
                notification.close(this.departmentLoadFailedNotificationKey);
                this.setState({ departments });
            })
            .catch(() => {
                notification.error({
                    key: this.departmentLoadFailedNotificationKey,
                    message: "Kon de afdelingen niet ophalen. Probeer later opnieuw.",
                    duration: null,
                });
            })
            .finally(() => {
                this.setState({ areDepartmentsLoading: false });
            });
    }

    private loadEducations(): void {
        this.setState({ areEducationsLoading: true });
        EducationsRepository.getEducationsByName()
            .then((educations) => {
                notification.close(this.educationLoadFailedNotificationKey);
                this.setState({ educations });
            })
            .catch(() => {
                notification.error({
                    key: this.educationLoadFailedNotificationKey,
                    message: "Kon de opleidingen niet ophalen. Probeer later opnieuw.",
                    duration: null,
                });
            })
            .finally(() => {
                this.setState({ areEducationsLoading: false });
            });
    }

    private getEducationById(educationId: string): Education | undefined {
        return this.state.educations.find((education) => education.id === educationId);
    }
}

export default PlanningsPage;
