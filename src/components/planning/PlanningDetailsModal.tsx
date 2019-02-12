import { Card, Col, List, Modal, Row } from "antd";
import moment from "moment";
import React from "react";
import { studentsPlannedInDay } from "../../helpers/filters";
import { sortByProp } from "../../helpers/sorters";
import { Department } from "../../models/Department";
import { Education } from "../../models/Education";
import { Student } from "../../models/Student";
import styles from "./PlanningDetailsModal.module.scss";
import { singleOrPlural } from "../../helpers/singlePlural";

interface IPlanningDetailsModalProps {
    departments: Department[];
    educations: Education[];
    students: Student[];
    selectedDate: moment.Moment | undefined;
    isVisible: boolean;
    onCloseRequested: () => void;
}

interface IPlanningDetailsModalState {
}

class PlanningDetailsModal extends React.Component<IPlanningDetailsModalProps, IPlanningDetailsModalState> {

    constructor(props: IPlanningDetailsModalProps) {
        super(props);

        this.state = {};

        this.renderTitle = this.renderTitle.bind(this);
        this.renderDepartments = this.renderDepartments.bind(this);
        this.renderWithoutDepartment = this.renderWithoutDepartment.bind(this);
        this.renderStudent = this.renderStudent.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    public render(): React.ReactNode {
        if (this.props.selectedDate === undefined) {
            return null;
        }

        const studentsPlannedThisDay = studentsPlannedInDay(this.props.students, this.props.selectedDate);

        return (
            <Modal
                visible={this.props.isVisible}
                onCancel={this.handleClose}
                width={700}
                footer={null}
                maskClosable={true}
            >
                {this.renderTitle(this.props.selectedDate)}
                {this.renderDepartments(studentsPlannedThisDay)}
                {this.renderWithoutDepartment(studentsPlannedThisDay)}
            </Modal>
        );
    }

    private renderTitle(date: moment.Moment): React.ReactNode {
        return (
            <h1 className={styles.title}>
                Planning voor&nbsp;
                <span className={styles.titleDate}>{date.format("dddd D MMMM YYYY")}</span>
            </h1>
        );
    }

    private renderDepartments(todaysStudents: Student[]): React.ReactNode {
        return this.props.departments.map((department) => {
            const plannedStudentsForDepartment =
                todaysStudents
                    .filter((student) => {
                        return student.internship !== undefined
                            && student.internship.departmentId === department.id;
                    })
                    .sort((a: Student, b: Student) => {
                        const educationA = this.getEducationById(a.educationId);
                        const educationB = this.getEducationById(b.educationId);
                        return sortByProp(educationA, educationB, "name");
                    });
            return (
                <Card key={department.id} bodyStyle={{ padding: 12 }} className={styles.departmentCard}>
                    <h2>
                        {department.name}&nbsp;
                        <small>
                            ({plannedStudentsForDepartment.length}/{department.totalCapacity})
                        </small>
                    </h2>
                    {plannedStudentsForDepartment.map((student) => this.renderStudent(student))}
                </Card>
            );
        });
    }

    private renderWithoutDepartment(todaysStudents: Student[]): React.ReactNode {
        const studentsWithoutDepartment = todaysStudents.filter((student) => {
            return student.internship !== undefined
                && student.internship.departmentId === undefined;
        });
        return (
            <Card key="noDepartment" bodyStyle={{ padding: 12 }} className={styles.departmentCard}>
                <h2 className={styles.withoutDepartmentTitle}>Zonder afdeling</h2>
                {studentsWithoutDepartment.map((student) => this.renderStudent(student))}
            </Card>
        );
    }

    private renderStudent(student: Student): React.ReactNode {
        const education = this.getEducationById(student.educationId);
        const internshipAmountOfDays = student.internship !== undefined
            ? student.internship.endDate.diff(student.internship.startDate, "days") + 1
            : 0;

        return (
            <Card key={student.id} className={styles.studentCard} bodyStyle={{ padding: 12 }}>
                <Row type="flex" justify="space-between" align="middle">
                    <Col>
                        <React.Fragment>
                            <span className={styles.studentName}>{student.fullName}</span>
                            &nbsp;
                            {education !== undefined &&
                                <span>({education.name})</span>
                            }
                        </React.Fragment>
                    </Col>
                    <Col className={styles.studentDateRangeCol}>
                        {student.internship !== undefined &&
                            <React.Fragment>
                                <span>{student.internship.startDate.format("DD/MM/YY")} - {student.internship.endDate.format("DD/MM/YY")}</span>
                                &nbsp;
                                <span className={styles.internshipDays}>({internshipAmountOfDays} {singleOrPlural(internshipAmountOfDays, "dag", "dagen")})</span>
                            </React.Fragment>
                        }
                    </Col>
                </Row>
            </Card>
        );
    }

    private handleClose(): void {
        this.props.onCloseRequested();
    }

    private getEducationById(educationId: string | undefined): Education | undefined {
        return this.props.educations.find((education) => education.id === educationId);
    }
}

export default PlanningDetailsModal;
