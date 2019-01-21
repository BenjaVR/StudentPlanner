import { Col, notification, Row } from "antd";
import React from "react";
import { IEducation } from "studentplanner-functions/shared/contract/IEducation";
import { ISchool } from "studentplanner-functions/shared/contract/ISchool";
import { IStudent } from "studentplanner-functions/shared/contract/IStudent";
import { RoutePageComponentProps, routes } from "../../routes";
import { EducationsService } from "../../services/EducationsService";
import { SchoolsService } from "../../services/SchoolsService";
import { StudentsService } from "../../services/StudentsService";
import AuthenticatedAppContainer from "../containers/AuthenticatedAppContainer";
import StudentFormModal from "./StudentsFormModal";
import StudentsTable from "./StudentsTable";

type StudentsPageProps = RoutePageComponentProps;

interface IStudentsPageState {
    students: IStudent[];
    isFetching: boolean;
    isAddStudentsModalVisible: boolean;
    isEditStudentsModalVisible: boolean;
    studentToEdit: IStudent | undefined;
    schools: ISchool[];
    isFetchingSchools: boolean;
    educations: IEducation[];
    isFetchingEducations: boolean;
}

export default class StudentsPage extends React.Component<StudentsPageProps, IStudentsPageState> {

    private readonly studentsService = new StudentsService();
    private readonly schoolsService = new SchoolsService();
    private readonly educationsService = new EducationsService();

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
        };

        this.openAddStudentModal = this.openAddStudentModal.bind(this);
        this.closeAddStudentModal = this.closeAddStudentModal.bind(this);
        this.openEditStudentModal = this.openEditStudentModal.bind(this);
        this.closeEditStudentModal = this.closeEditStudentModal.bind(this);
        this.addStudent = this.addStudent.bind(this);
        this.editStudent = this.editStudent.bind(this);
        this.deleteStudent = this.deleteStudent.bind(this);
    }

    public componentDidMount(): void {
        this.studentsService.subscribe((students) => {
            this.setState({
                isFetching: false,
                students,
            });
        });
        this.schoolsService.subscribe((schools) => {
            this.setState({
                isFetchingSchools: false,
                schools,
            });
        });
        this.educationsService.subscribe((educations) => {
            this.setState({
                isFetchingEducations: false,
                educations,
            });
        });
    }

    public componentWillUnmount(): void {
        this.studentsService.unsubscribe();
        this.schoolsService.unsubscribe();
        this.educationsService.unsubscribe();
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <AuthenticatedAppContainer router={{ history: this.props.history }} initialRoute={routes.studentsRoute}>
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
                            />
                        </Col>
                    </Row>
                </AuthenticatedAppContainer>
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

    private openEditStudentModal(student: IStudent): void {
        this.setState({
            isEditStudentsModalVisible: true,
            studentToEdit: student,
        });
    }

    private closeEditStudentModal(): void {
        this.setState({ isEditStudentsModalVisible: false });
    }

    private addStudent(student: IStudent): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            this.studentsService.add(student)
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

    private editStudent(student: IStudent): Promise<void> {
        student.id = this.state.studentToEdit!.id;
        return new Promise<void>((resolve, reject): void => {
            this.studentsService.update(student)
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

    private deleteStudent(student: IStudent): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            this.studentsService.delete(student)
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
