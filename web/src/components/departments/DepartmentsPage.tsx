import { Col, notification, Row } from "antd";
import React from "react";
import { Department } from "../../models/Department";
import { Education } from "../../models/Education";
import { AnyRouteComponentProps } from "../../routes";
import { DepartmentsRepository } from "../../services/DepartmentsRepository";
import { EducationsRepository } from "../../services/EducationsRepository";
import DepartmentFormModal from "./DepartmentsFormModal";
import DepartmentsTable from "./DepartmentsTable";

type DepartmentsPageProps = AnyRouteComponentProps;

interface IDepartmentsPageState {
    departments: Department[];
    isFetching: boolean;
    isAddDepartmentModalVisible: boolean;
    isEditDepartmentModalVisible: boolean;
    departmentToEdit: Department | undefined;
    educations: Education[];
    areEducationsFetching: boolean;
}

export default class DepartmentsPage extends React.Component<DepartmentsPageProps, IDepartmentsPageState> {

    private unsubscribeFromDepartments: () => void;

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

        this.unsubscribeFromDepartments = () => { return; };

        this.openAddDepartmentModal = this.openAddDepartmentModal.bind(this);
        this.closeAddDepartmentModal = this.closeAddDepartmentModal.bind(this);
        this.openEditDepartmentModal = this.openEditDepartmentModal.bind(this);
        this.closeEditDepartmentModal = this.closeEditDepartmentModal.bind(this);
        this.addDepartment = this.addDepartment.bind(this);
        this.editDepartment = this.editDepartment.bind(this);
        this.deleteDepartment = this.deleteDepartment.bind(this);
    }

    public componentDidMount(): void {
        this.unsubscribeFromDepartments = DepartmentsRepository.subscribeToDepartments((departments) => {
            this.setState({
                isFetching: false,
                departments,
            });
        });
        EducationsRepository.getEducationsByName()
            .then((educations) => {
                this.setState({
                    areEducationsFetching: false,
                    educations,
                });
            });
    }

    public componentWillUnmount(): void {
        this.unsubscribeFromDepartments();
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
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

    private openEditDepartmentModal(department: Department): void {
        this.setState({
            isEditDepartmentModalVisible: true,
            departmentToEdit: department,
        });
    }

    private closeEditDepartmentModal(): void {
        this.setState({ isEditDepartmentModalVisible: false });
    }

    private addDepartment(department: Department): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            DepartmentsRepository.addDepartment(department)
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

    private editDepartment(department: Department): Promise<void> {
        department.id = this.state.departmentToEdit!.id;
        return new Promise<void>((resolve, reject): void => {
            DepartmentsRepository.updateDepartment(department)
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

    private deleteDepartment(department: Department): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            DepartmentsRepository.deleteDepartment(department)
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
