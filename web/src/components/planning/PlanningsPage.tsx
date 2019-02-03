import { Button, Calendar, Col, List, notification, Row, Spin, Tag, Tooltip } from "antd";
import React from "react";
import { IDepartment } from "studentplanner-functions/shared/contract/IDepartment";
import { IInternship } from "studentplanner-functions/shared/contract/IInternship";
import { IStudent } from "studentplanner-functions/shared/contract/IStudent";
import { Internship } from "../../models/Internship";
import { AnyRouteComponentProps } from "../../routes";
import { DepartmentsService } from "../../services/DepartmentsService";
import { InternshipRepository } from "../../services/InternshipRepository";
import { StudentsService } from "../../services/StudentsService";
import PlanningsFormModal from "./PlanningsFormModal";
import styles from "./PlanningsPage.module.scss";

type PlanningsPageProps = AnyRouteComponentProps;

interface IPlanningsPageState {
    unplannedStudents: IStudent[];
    areStudentsLoading: boolean;
    selectedStudentToPlan: IStudent | undefined;
    showOnlyConfirmedStudents: boolean;
    isCalendarLoading: boolean;
    isAddInternshipModalVisible: boolean;
    internshipToEdit: IInternship | undefined;
    departments: IDepartment[];
    areDepartmentsLoading: boolean;
}

class PlanningsPage extends React.Component<PlanningsPageProps, IPlanningsPageState> {

    private calendarRef: Calendar | null = null;

    private readonly studentsService = new StudentsService();
    private readonly departmentsService = new DepartmentsService();
    private readonly studentLoadFailedNotificationKey = "studentLoadFailed";
    private readonly departmentLoadFailedNotificationKey = "departmentLoadFailed";

    constructor(props: PlanningsPageProps) {
        super(props);

        this.state = {
            unplannedStudents: [],
            areStudentsLoading: false,
            selectedStudentToPlan: undefined,
            showOnlyConfirmedStudents: true,
            isCalendarLoading: false,
            isAddInternshipModalVisible: false,
            internshipToEdit: undefined,
            departments: [],
            areDepartmentsLoading: false,
        };

        this.renderStudentListHeader = this.renderStudentListHeader.bind(this);
        this.renderStudentListItem = this.renderStudentListItem.bind(this);
        this.handleReloadStudents = this.handleReloadStudents.bind(this);
        this.handleNextMonth = this.handleNextMonth.bind(this);
        this.handlePrevMonth = this.handlePrevMonth.bind(this);
        this.addInternship = this.addInternship.bind(this);
        this.closeAddInternshipModal = this.closeAddInternshipModal.bind(this);
    }

    public componentWillMount(): void {
        this.loadStudents();

        this.setState({ areDepartmentsLoading: true });
        this.departmentsService.list()
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

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <Row type="flex">
                    <Col span={24} xl={16}>
                        <Spin spinning={this.state.isCalendarLoading}>
                            <div className={styles.buttonsInCalendarComponent}>
                                <Button icon="left" onClick={this.handlePrevMonth} />
                                <Button icon="right" onClick={this.handleNextMonth} />
                            </div>
                            <Calendar mode="month" ref={(ref) => this.calendarRef = ref} />
                        </Spin>
                    </Col>
                    <Col span={24} xl={8}>
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
                        : `Nieuwe stage toevoegen voor ${this.state.selectedStudentToPlan.firstName}`}
                    okText="Voeg toe"
                    isVisible={this.state.isAddInternshipModalVisible}
                    submitInternship={this.addInternship}
                    studentToPlan={this.state.selectedStudentToPlan}
                    onCloseRequest={this.closeAddInternshipModal}
                    internshipToEdit={undefined}
                    departments={this.state.departments}
                    areDepartmentsLoading={this.state.areDepartmentsLoading}
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

    private renderStudentListItem(student: IStudent): React.ReactNode {
        const onListItemClickFn = () => this.handlePlanStudent(student);
        return (
            <List.Item actions={[<a key={0} onClick={onListItemClickFn}>Inplannen</a>]}>
                {student.firstName} {student.lastName}
                &nbsp;
                {!student.isConfirmed &&
                    <Tag className={styles.notClickableTag} color="volcano">Niet bevestigd</Tag>
                }
            </List.Item>
        );
    }

    private handleReloadStudents(): void {
        this.loadStudents();
    }

    private handlePlanStudent(student: IStudent): void {
        this.openAddInternshipModal(student);
    }

    private handleNextMonth(): void {
        this.doMonthChange("next");
    }

    private handlePrevMonth(): void {
        this.doMonthChange("prev");
    }

    private openAddInternshipModal(student: IStudent): void {
        this.setState({
            selectedStudentToPlan: student,
            isAddInternshipModalVisible: true,
        });
    }

    private closeAddInternshipModal(): void {
        this.setState({ isAddInternshipModalVisible: false });
    }

    private addInternship(internship: Internship): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            if (this.state.selectedStudentToPlan === undefined) {
                return reject("No student selected");
            }
            InternshipRepository.addOrUpdateInternshipForStudent(internship, this.state.selectedStudentToPlan)
                .then(() => {
                    notification.success({
                        message: "Stage succesvol toegevoegd",
                    });
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

    private loadStudents(): void {
        this.setState({ areStudentsLoading: true });
        this.studentsService.getNotPlannedStudents()
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
}

export default PlanningsPage;
