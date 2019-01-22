import { Col, notification, Row } from "antd";
import React from "react";
import { IDepartment } from "studentplanner-functions/shared/contract/IDepartment";
import { IEducation } from "studentplanner-functions/shared/contract/IEducation";
import { RoutePageComponentProps, routes } from "../../routes";
import { DepartmentsService } from "../../services/DepartmentsService";
import { EducationsService } from "../../services/EducationsService";
import AuthenticatedAppContainer from "../containers/AppContainer";
import DepartmentFormModal from "./DepartmentsFormModal";
import DepartmentsTable from "./DepartmentsTable";

type DepartmentsPageProps = RoutePageComponentProps;

interface IDepartmentsPageState {
    departments: IDepartment[];
    isFetching: boolean;
    isAddDepartmentModalVisible: boolean;
    isEditDepartmentModalVisible: boolean;
    departmentToEdit: IDepartment | undefined;
    educations: IEducation[];
    areEducationsFetching: boolean;
}

export default class DepartmentsPage extends React.Component<DepartmentsPageProps, IDepartmentsPageState> {

    private readonly departmentsService = new DepartmentsService();
    private readonly educationsService = new EducationsService();

    constructor(props: DepartmentsPageProps) {
        super(props);

        this.state = {
            departments: [],
            isFetching: true,
            isAddDepartmentModalVisible: false,
            isEditDepartmentModalVisible: false,
            departmentToEdit: undefined,
            educations: [],
            areEducationsFetching: true,
        };

        this.openAddDepartmentModal = this.openAddDepartmentModal.bind(this);
        this.closeAddDepartmentModal = this.closeAddDepartmentModal.bind(this);
        this.openEditDepartmentModal = this.openEditDepartmentModal.bind(this);
        this.closeEditDepartmentModal = this.closeEditDepartmentModal.bind(this);
        this.addDepartment = this.addDepartment.bind(this);
        this.editDepartment = this.editDepartment.bind(this);
        this.deleteDepartment = this.deleteDepartment.bind(this);
    }

    public componentDidMount(): void {
        this.departmentsService.subscribe((departments) => {
            this.setState({
                isFetching: false,
                departments,
            });
        });
        this.educationsService.subscribe((educations) => {
            this.setState({
                areEducationsFetching: false,
                educations,
            });
        });
    }

    public componentWillUnmount(): void {
        this.educationsService.unsubscribe();
        this.departmentsService.unsubscribe();
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <AuthenticatedAppContainer router={{ history: this.props.history }} initialRoute={routes.departmentsRoute}>
                    <Row>
                        <Col>
                            <DepartmentsTable
                                isLoading={this.state.isFetching}
                                departments={this.state.departments}
                                deleteDepartment={this.deleteDepartment}
                                onAddDepartmentRequest={this.openAddDepartmentModal}
                                onEditDepartmentRequest={this.openEditDepartmentModal}
                            />
                        </Col>
                    </Row>
                </AuthenticatedAppContainer>
                <DepartmentFormModal
                    title="Nieuwe afdeling toevoegen"
                    okText="Voeg toe"
                    isVisible={this.state.isAddDepartmentModalVisible}
                    submitDepartment={this.addDepartment}
                    onCloseRequest={this.closeAddDepartmentModal}
                    departmentToEdit={undefined}
                    educations={this.state.educations}
                    isEducationsLoading={this.state.areEducationsFetching}
                />
                <DepartmentFormModal
                    title="Afdeling bewerken"
                    okText="Bewerk"
                    isVisible={this.state.isEditDepartmentModalVisible}
                    submitDepartment={this.editDepartment}
                    onCloseRequest={this.closeEditDepartmentModal}
                    departmentToEdit={this.state.departmentToEdit}
                    educations={this.state.educations}
                    isEducationsLoading={this.state.areEducationsFetching}
                />
            </React.Fragment>
        );
    }

    private openAddDepartmentModal(): void {
        this.setState({ isAddDepartmentModalVisible: true });
    }

    private closeAddDepartmentModal(): void {
        this.setState({ isAddDepartmentModalVisible: false });
    }

    private openEditDepartmentModal(department: IDepartment): void {
        this.setState({
            isEditDepartmentModalVisible: true,
            departmentToEdit: department,
        });
    }

    private closeEditDepartmentModal(): void {
        this.setState({ isEditDepartmentModalVisible: false });
    }

    private addDepartment(department: IDepartment): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            this.departmentsService.add(department)
                .then(() => {
                    notification.success({
                        message: `Afdeling "${department.name}" succesvol toegevoegd`,
                    });
                    resolve();
                })
                .catch((error) => {
                    notification.error({
                        message: "Kon afdeling niet toevoegen",
                    });
                    reject(error);
                });
        });
    }

    private editDepartment(department: IDepartment): Promise<void> {
        department.id = this.state.departmentToEdit!.id;
        return new Promise<void>((resolve, reject): void => {
            this.departmentsService.update(department)
                .then(() => {
                    notification.success({
                        message: `Afdeling "${department.name}" succesvol bewerkt`,
                    });
                    resolve();
                })
                .catch((error) => {
                    notification.error({
                        message: "Kon afdeling niet bewerken",
                    });
                    reject(error);
                });
        });
    }

    private deleteDepartment(department: IDepartment): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            this.departmentsService.delete(department)
                .then(() => {
                    notification.success({
                        message: `Afdeling "${department.name}" succesvol verwijderd`,
                    });
                    resolve();
                })
                .catch((error) => {
                    notification.error({
                        message: `Kon afdeling "${department.name}" niet verwijderen, probeer later opnieuw`,
                    });
                    reject(error);
                });
        });
    }
}
