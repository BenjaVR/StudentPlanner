import { Col, notification, Row } from "antd";
import React from "react";
import { Department } from "../../models/Department";
import { Education } from "../../models/Education";
import { School } from "../../models/School";
import { Student } from "../../models/Student";
import { AnyRouteComponentProps } from "../../routes";
import { DepartmentsRepository } from "../../services/repositories/DepartmentsRepository";
import { EducationsRepository } from "../../services/repositories/EducationsRepository";
import { SchoolsRepository } from "../../services/repositories/SchoolsRepository";
import { StudentsRepository } from "../../services/repositories/StudentsRepository";
import StudentFormModal from "./StudentsFormModal";
import StudentsTable from "./StudentsTable";

type StudentsPageProps = AnyRouteComponentProps;

interface IStudentsPageState {
    students: Student[];
    isFetching: boolean;
    isAddStudentsModalVisible: boolean;
    isEditStudentsModalVisible: boolean;
    studentToEdit: Student | undefined;
    schools: School[];
    isFetchingSchools: boolean;
    educations: Education[];
    isFetchingEducations: boolean;
    departments: Department[];
    isFetchingDepartments: boolean;
}

export default class StudentsPage extends React.Component<StudentsPageProps, IStudentsPageState> {

    private unsubscribeFromStudents: () => void;

    constructor(props: StudentsPageProps) {
        super(props);

        this.state = {
            students: [],
            isFetching: true,
            isAddStudentsModalVisible: false,
            isEditStudentsModalVisible: false,
            studentToEdit: undefined,
            schools: [],
            isFetchingSchools: true,
            educations: [],
            isFetchingEducations: true,
            departments: [],
            isFetchingDepartments: true,
        };

        this.unsubscribeFromStudents = () => { return; };

        this.openAddStudentModal = this.openAddStudentModal.bind(this);
        this.closeAddStudentModal = this.closeAddStudentModal.bind(this);
        this.openEditStudentModal = this.openEditStudentModal.bind(this);
        this.closeEditStudentModal = this.closeEditStudentModal.bind(this);
        this.addStudent = this.addStudent.bind(this);
        this.editStudent = this.editStudent.bind(this);
        this.deleteStudent = this.deleteStudent.bind(this);
    }

    public componentDidMount(): void {
        this.unsubscribeFromStudents = StudentsRepository.subscribeToStudents((students) => {
            this.setState({
                isFetching: false,
                students,
            });
        });
        SchoolsRepository.getSchoolsByName()
            .then((schools) => {
                this.setState({
                    isFetchingSchools: false,
                    schools,
                });
            });
        EducationsRepository.getEducationsByName()
            .then((educations) => {
                this.setState({
                    isFetchingEducations: false,
                    educations,
                });
            });
        DepartmentsRepository.getDepartmentsByName()
            .then((departments) => {
                this.setState({
                    isFetchingDepartments: false,
                    departments,
                });
            });
    }

    public componentWillUnmount(): void {
        this.unsubscribeFromStudents();
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <Row>
                    <Col>
                        <StudentsTable
                            isLoading={this.state.isFetching}
                            students={this.state.students}
                            deleteStudent={this.deleteStudent}
                            onAddStudentRequest={this.openAddStudentModal}
                            onEditStudentRequest={this.openEditStudentModal}
                            schools={this.state.schools}
                            isLoadingSchools={this.state.isFetchingSchools}
                            educations={this.state.educations}
                            isLoadingEducations={this.state.isFetchingEducations}
                            departments={this.state.departments}
                            isLoadingDepartments={this.state.isFetchingDepartments}
                        />
                    </Col>
                </Row>
                <StudentFormModal
                    title="Nieuwe student toevoegen"
                    okText="Voeg toe"
                    isVisible={this.state.isAddStudentsModalVisible}
                    submitStudent={this.addStudent}
                    onCloseRequest={this.closeAddStudentModal}
                    studentToEdit={undefined}
                    schools={this.state.schools}
                    isLoadingSchools={this.state.isFetchingSchools}
                    educations={this.state.educations}
                    isLoadingEducations={this.state.isFetchingEducations}
                />
                <StudentFormModal
                    title="Student bewerken"
                    okText="Bewerk"
                    isVisible={this.state.isEditStudentsModalVisible}
                    submitStudent={this.editStudent}
                    onCloseRequest={this.closeEditStudentModal}
                    studentToEdit={this.state.studentToEdit}
                    schools={this.state.schools}
                    isLoadingSchools={this.state.isFetchingSchools}
                    educations={this.state.educations}
                    isLoadingEducations={this.state.isFetchingEducations}
                />
            </React.Fragment>
        );
    }

    private openAddStudentModal(): void {
        this.setState({ isAddStudentsModalVisible: true });
    }

    private closeAddStudentModal(): void {
        this.setState({ isAddStudentsModalVisible: false });
    }

    private openEditStudentModal(student: Student): void {
        this.setState({
            isEditStudentsModalVisible: true,
            studentToEdit: student,
        });
    }

    private closeEditStudentModal(): void {
        this.setState({ isEditStudentsModalVisible: false });
    }

    private addStudent(student: Student): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            StudentsRepository.addStudent(student)
                .then(() => {
                    notification.success({
                        message: `Student "${student.firstName}" succesvol toegevoegd`,
                    });
                    resolve();
                })
                .catch((error) => {
                    notification.error({
                        message: "Kon student niet toevoegen",
                    });
                    reject(error);
                });
        });
    }

    private editStudent(student: Student): Promise<void> {
        student.id = this.state.studentToEdit!.id;
        return new Promise<void>((resolve, reject): void => {
            StudentsRepository.updateStudent(student)
                .then(() => {
                    notification.success({
                        message: `Student "${student.firstName}" succesvol bewerkt`,
                    });
                    resolve();
                })
                .catch((error) => {
                    notification.error({
                        message: "Kon student niet bewerken",
                    });
                    reject(error);
                });
        });
    }

    private deleteStudent(student: Student): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            StudentsRepository.deleteStudent(student)
                .then(() => {
                    notification.success({
                        message: `Student "${student.firstName}" succesvol verwijderd`,
                    });
                    resolve();
                })
                .catch((error) => {
                    notification.error({
                        message: `Kon student "${student.firstName}" niet verwijderen, probeer later opnieuw`,
                    });
                    reject(error);
                });
        });
    }
}
