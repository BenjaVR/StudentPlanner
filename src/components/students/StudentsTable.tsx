import { Button, Col, Modal, notification, Popconfirm, Row, Spin, Table, Tooltip } from "antd";
import { ColumnFilterItem, ColumnProps } from "antd/lib/table";
import React from "react";
import { emptyFilterOptionValue, exactMatchOrDefaultOptionFilter, hasElementWithId } from "../../helpers/filters";
import { stringSorter } from "../../helpers/sorters";
import { Department } from "../../models/Department";
import { Education } from "../../models/Education";
import { School } from "../../models/School";
import { Student } from "../../models/Student";
import { StudentsRepository } from "../../services/repositories/StudentsRepository";
import styles from "../DataTable.module.scss";
import specificStyles from "./StudentsTable.module.scss";

interface IStudentsTableProps {
    isLoading: boolean;
    students: Student[];
    schools: School[];
    isLoadingSchools: boolean;
    educations: Education[];
    isLoadingEducations: boolean;
    departments: Department[];
    isLoadingDepartments: boolean;
    deleteStudent: (student: Student) => Promise<void>;
    onAddStudentRequest: () => void;
    onEditStudentRequest: (student: Student) => void;
}

interface IStudentTableState {
    isPlanningDetailsOpen: boolean;
    selectedStudentPlanningDetails: Student | undefined;
    isDeletingInternship: boolean;
}

class StudentsTable extends React.Component<IStudentsTableProps, IStudentTableState> {

    constructor(props: IStudentsTableProps) {
        super(props);

        this.state = {
            isPlanningDetailsOpen: false,
            selectedStudentPlanningDetails: undefined,
            isDeletingInternship: false,
        };

        this.renderSchoolName = this.renderSchoolName.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.renderTableTitle = this.renderTableTitle.bind(this);
        this.renderPlannedCell = this.renderPlannedCell.bind(this);
        this.handleClosePlanningDetails = this.handleClosePlanningDetails.bind(this);
        this.handleDeleteInternshipForStudent = this.handleDeleteInternshipForStudent.bind(this);
    }

    public render(): React.ReactNode {
        const selectedStudent = this.state.selectedStudentPlanningDetails;
        const deleteStudentFn = () => selectedStudent !== undefined
            ? this.handleDeleteInternshipForStudent(selectedStudent)
            : {};
        const departmentsNameForStudent = selectedStudent !== undefined
            ? this.getDepartmentNameForStudent(selectedStudent)
            : undefined;
        const columns = this.getTableColumns();
        const startDate = selectedStudent !== undefined && selectedStudent.internship !== undefined ? selectedStudent.internship.startDate.format("DD/MM/YYYY") : "";
        const endDate = selectedStudent !== undefined && selectedStudent.internship !== undefined ? selectedStudent.internship.endDate.format("DD/MM/YYYY") : "";
        const internshipNumberOfDays = selectedStudent !== undefined ? selectedStudent.internshipNumberOfDays : 0;
        const internshipNumberOfHours = selectedStudent !== undefined && selectedStudent.internship !== undefined ? selectedStudent.internship.hours : 0;
        return (
            <React.Fragment>
                <Table
                    title={this.renderTableTitle}
                    columns={columns}
                    rowKey={this.generateTableRowKey}
                    dataSource={this.props.students}
                    loading={this.props.isLoading}
                    size="middle"
                    bordered={true}
                    scroll={{ x: true }}
                    className={styles.table}
                />
                <Modal
                    confirmLoading={this.props.isLoadingDepartments}
                    title={`Stage voor ${selectedStudent !== undefined ? selectedStudent.fullName : ""}`}
                    visible={this.state.isPlanningDetailsOpen}
                    closable={true}
                    maskClosable={false}
                    onCancel={this.handleClosePlanningDetails}
                    footer={(
                        <div className={specificStyles.studentInternshipModalFooter}>
                            <Popconfirm title="Weet u zeker dat u deze stage wilt verwijderen?" onConfirm={deleteStudentFn}>
                                <Button type="danger" ghost={true} loading={this.state.isDeletingInternship}>Stage verwijderen</Button>
                            </Popconfirm>
                        </div>
                    )}
                    destroyOnClose={true}
                >
                    <p>
                        Van <b>{startDate}</b> tot en met <b>{endDate}</b>
                        {departmentsNameForStudent !== undefined &&
                            <React.Fragment>
                                &nbsp;in <b>{departmentsNameForStudent}</b>
                            </React.Fragment>
                        }
                        .
                    </p>
                    <p>
                        <b>{internshipNumberOfDays}</b> {internshipNumberOfDays === 1 ? "dag" : "dagen"} (<b>{internshipNumberOfHours}</b> {internshipNumberOfHours === 1 ? "uur" : "uren"}).
                    </p>
                </Modal>
            </React.Fragment>
        );
    }

    private renderSchoolName(student: Student): React.ReactNode {
        if (this.props.isLoadingSchools) {
            return <Spin size="small" spinning={true} />;
        }

        if (student.schoolId === undefined) {
            return null;
        }

        return this.getSchoolNameForStudent(student);
    }

    private renderEducationName(student: Student): React.ReactNode {
        if (this.props.isLoadingEducations) {
            return <Spin size="small" spinning={true} />;
        }

        if (student.educationId === undefined) {
            return null;
        }

        return this.getEducationNameForStudent(student);
    }

    private renderActions(student: Student): React.ReactNode {
        const deleteFunc = () => this.props.deleteStudent(student);
        const editFunc = () => this.props.onEditStudentRequest(student);
        return (
            <React.Fragment>
                <Tooltip title="Bewerken">
                    <Button
                        size="small"
                        icon="edit"
                        type="primary"
                        ghost={true}
                        onClick={editFunc}
                        className={styles.actionButton}
                    />
                </Tooltip>
                <Tooltip title="Verwijderen">
                    <Popconfirm
                        title="Weet u zeker dat u deze student wilt verwijderen?"
                        onConfirm={deleteFunc}
                    >
                        <Button
                            size="small"
                            icon="delete"
                            type="danger"
                            ghost={true}
                            className={styles.actionButton}
                        />
                    </Popconfirm>
                </Tooltip>
            </React.Fragment>
        );
    }

    private renderTableTitle(): React.ReactNode {
        return (
            <Row type="flex" justify="space-between" align="middle">
                <Col>
                    <Button icon="plus" type="primary" onClick={this.props.onAddStudentRequest}>
                        Nieuwe student
                    </Button>
                </Col>
            </Row>
        );
    }

    private handleDeleteInternshipForStudent(student: Student): void {
        StudentsRepository.removeInternshipForStudent(student)
            .then(() => {
                this.setState({
                    isPlanningDetailsOpen: false,
                    selectedStudentPlanningDetails: undefined,
                });
            })
            .catch(() => {
                notification.error({
                    message: "Kon stage niet verwijderen, probeer later opnieuw",
                });
            });
    }

    private generateTableRowKey(record: Student, index: number): string {
        return record.id || index.toString();
    }

    private getSchoolNameForStudent(student: Student): string {
        const school = this.props.schools.find((s) => student.schoolId !== undefined && student.schoolId === s.id);
        if (school === undefined) {
            return "";
        }

        return school.name;
    }

    private getEducationNameForStudent(student: Student): string {
        const education = this.props.educations.find((e) => student.educationId !== undefined && student.educationId === e.id);
        if (education === undefined) {
            return "";
        }
        return education.name;
    }

    private getDepartmentNameForStudent(student: Student): string | undefined {
        if (student.internship === undefined || student.internship.departmentId === undefined) {
            return undefined;
        }
        const studentsDepartmentId = student.internship.departmentId;
        const department = this.props.departments.find((d) => studentsDepartmentId === d.id);
        if (department === undefined) {
            return undefined;
        }
        return department.name;
    }

    private getTableColumns(): Array<ColumnProps<Student>> {
        return [
            {
                title: "Naam",
                key: "name",
                render: (record: Student) => record.fullName,
                sorter: (a, b) => stringSorter(a.fullName, b.fullName),
            },
            {
                title: "School",
                key: "school",
                render: (record: Student) => this.renderSchoolName(record),
                sorter: (a, b) => stringSorter(this.getSchoolNameForStudent(a), this.getSchoolNameForStudent(b)),
                filters: this.getSchoolFilters(),
                onFilter: (value, record: Student) => {
                    return exactMatchOrDefaultOptionFilter(value,
                        hasElementWithId(this.props.schools, record.schoolId)
                            ? record.schoolId
                            : undefined);
                },
            },
            {
                title: "Opleiding",
                key: "education",
                render: (record: Student) => this.renderEducationName(record),
                sorter: (a, b) => stringSorter(this.getEducationNameForStudent(a), this.getEducationNameForStudent(b)),
                filters: this.getEducationFilters(),
                onFilter: (value, record: Student) => {
                    return exactMatchOrDefaultOptionFilter(value,
                        hasElementWithId(this.props.educations, record.educationId)
                            ? record.educationId
                            : undefined);
                },
            },
            {
                title: "Bevestigd",
                key: "isConfirmed",
                render: (record: Student) => record.isConfirmed ? "Ja" : "",
                filters: [{ text: "Bevestigd", value: "1" }, { text: "Niet bevestigd", value: "0" }],
                onFilter: (value, record: Student) => exactMatchOrDefaultOptionFilter(value, record.isConfirmed ? "1" : "0"),
            },
            {
                title: "Ingepland",
                key: "isPlanned",
                render: (record: Student) => this.renderPlannedCell(record),
                filters: [{ text: "Ingepland", value: "1" }, { text: "Niet ingepland", value: "0" }],
                onFilter: (value, record: Student) => exactMatchOrDefaultOptionFilter(value, record.isPlanned ? "1" : "0"),
            },
            {
                title: "Acties",
                key: "actions",
                width: 120,
                align: "center",
                render: (record: Student) => this.renderActions(record),
            },
        ];
    }

    private renderPlannedCell(student: Student): React.ReactNode {
        if (!student.isPlanned) {
            return null;
        }
        const openPlanningsDetailsFn = () => this.showPlanningDetails(student);
        return (
            <React.Fragment>
                <span>Ja</span>
                &nbsp;
                (<a onClick={openPlanningsDetailsFn}>details</a>)
            </React.Fragment>
        );
    }

    private showPlanningDetails(student: Student): void {
        this.setState({
            isPlanningDetailsOpen: true,
            selectedStudentPlanningDetails: student,
        });
    }

    private handleClosePlanningDetails(): void {
        this.setState({
            isPlanningDetailsOpen: false,
        });
    }

    private getSchoolFilters(): ColumnFilterItem[] {
        const filters: ColumnFilterItem[] = this.props.schools.map((school) => {
            return {
                text: school.name,
                value: school.id!,
            };
        });
        filters.unshift({
            text: "Zonder school",
            value: emptyFilterOptionValue,
        });
        return filters;
    }

    private getEducationFilters(): ColumnFilterItem[] {
        const filters: ColumnFilterItem[] = this.props.educations.map((education) => {
            return {
                text: education.name,
                value: education.id!,
            };
        });
        filters.unshift({
            text: "Zonder opleiding",
            value: emptyFilterOptionValue,
        });
        return filters;
    }
}

export default StudentsTable;
