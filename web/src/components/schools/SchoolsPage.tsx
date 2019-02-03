import { Col, notification, Row } from "antd";
import React from "react";
import { School } from "../../models/School";
import { AnyRouteComponentProps } from "../../routes";
import { SchoolsRepository } from "../../services/repositories/SchoolsRepository";
import SchoolFormModal from "./SchoolsFormModal";
import SchoolsTable from "./SchoolsTable";

type SchoolsPageProps = AnyRouteComponentProps;

interface ISchoolsPageState {
    schools: School[];
    isFetching: boolean;
    isAddSchoolsModalVisible: boolean;
    isEditSchoolsModalVisible: boolean;
    schoolToEdit: School | undefined;
}

export default class SchoolsPage extends React.Component<SchoolsPageProps, ISchoolsPageState> {

    private unsubscribeFromSchool: () => void;

    constructor(props: SchoolsPageProps) {
        super(props);

        this.state = {
            schools: [],
            isFetching: true,
            isAddSchoolsModalVisible: false,
            isEditSchoolsModalVisible: false,
            schoolToEdit: undefined,
        };

        this.unsubscribeFromSchool = () => { return; };

        this.openAddSchoolModal = this.openAddSchoolModal.bind(this);
        this.closeAddSchoolModal = this.closeAddSchoolModal.bind(this);
        this.openEditSchoolModal = this.openEditSchoolModal.bind(this);
        this.closeEditSchoolModal = this.closeEditSchoolModal.bind(this);
        this.addSchool = this.addSchool.bind(this);
        this.editSchool = this.editSchool.bind(this);
        this.deleteSchool = this.deleteSchool.bind(this);
    }

    public componentDidMount(): void {
        this.unsubscribeFromSchool = SchoolsRepository.subscribeToSchools((schools) => {
            this.setState({
                isFetching: false,
                schools,
            });
        });
    }

    public componentWillUnmount(): void {
        this.unsubscribeFromSchool();
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <Row>
                    <Col>
                        <SchoolsTable
                            isLoading={this.state.isFetching}
                            schools={this.state.schools}
                            deleteSchool={this.deleteSchool}
                            onAddSchoolRequest={this.openAddSchoolModal}
                            onEditSchoolRequest={this.openEditSchoolModal}
                        />
                    </Col>
                </Row>
                <SchoolFormModal
                    title="Nieuwe school toevoegen"
                    okText="Voeg toe"
                    isVisible={this.state.isAddSchoolsModalVisible}
                    submitSchool={this.addSchool}
                    onCloseRequest={this.closeAddSchoolModal}
                    schoolToEdit={undefined}
                />
                <SchoolFormModal
                    title="School bewerken"
                    okText="Bewerk"
                    isVisible={this.state.isEditSchoolsModalVisible}
                    submitSchool={this.editSchool}
                    onCloseRequest={this.closeEditSchoolModal}
                    schoolToEdit={this.state.schoolToEdit}
                />
            </React.Fragment>
        );
    }

    private openAddSchoolModal(): void {
        this.setState({ isAddSchoolsModalVisible: true });
    }

    private closeAddSchoolModal(): void {
        this.setState({ isAddSchoolsModalVisible: false });
    }

    private openEditSchoolModal(school: School): void {
        this.setState({
            isEditSchoolsModalVisible: true,
            schoolToEdit: school,
        });
    }

    private closeEditSchoolModal(): void {
        this.setState({ isEditSchoolsModalVisible: false });
    }

    private addSchool(school: School): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            SchoolsRepository.addSchool(school)
                .then(() => {
                    notification.success({
                        message: `School "${school.name}" succesvol toegevoegd`,
                    });
                    resolve();
                })
                .catch((error) => {
                    notification.error({
                        message: "Kon school niet toevoegen",
                    });
                    reject(error);
                });
        });
    }

    private editSchool(school: School): Promise<void> {
        school.id = this.state.schoolToEdit!.id;
        return new Promise<void>((resolve, reject): void => {
            SchoolsRepository.updateSchool(school)
                .then(() => {
                    notification.success({
                        message: `School "${school.name}" succesvol bewerkt`,
                    });
                    resolve();
                })
                .catch((error) => {
                    notification.error({
                        message: "Kon school niet bewerken",
                    });
                    reject(error);
                });
        });
    }

    private deleteSchool(school: School): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            SchoolsRepository.deleteSchool(school)
                .then(() => {
                    notification.success({
                        message: `School "${school.name}" succesvol verwijderd`,
                    });
                    resolve();
                })
                .catch((error) => {
                    notification.error({
                        message: `Kon school "${school.name}" niet verwijderen, probeer later opnieuw`,
                    });
                    reject(error);
                });
        });
    }
}
