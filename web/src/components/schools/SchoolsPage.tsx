import { Col, notification, Row } from "antd";
import React from "react";
import { ISchool } from "../../models/School";
import { RoutePageComponentProps } from "../../routes";
import { SchoolsService } from "../../services/SchoolsService";
import EducationsTable from "../EducationsTable";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import SchoolFormModal from "./SchoolFormModal";
import SchoolList from "./SchoolList";

type SchoolsPageProps = RoutePageComponentProps;

interface ISchoolsPageState {
    schools: ISchool[];
    isFetching: boolean;
    isAddSchoolModalVisible: boolean;
    isEditSchoolModalVisible: boolean;
    schoolToEdit: ISchool | undefined;
}

export default class SchoolsPage extends React.Component<SchoolsPageProps, ISchoolsPageState> {

    private readonly schoolsService = new SchoolsService();

    constructor(props: SchoolsPageProps) {
        super(props);

        this.state = {
            schools: [],
            isFetching: true,
            isAddSchoolModalVisible: false,
            isEditSchoolModalVisible: false,
            schoolToEdit: undefined,
        };

        this.openAddSchoolModal = this.openAddSchoolModal.bind(this);
        this.closeAddSchoolModal = this.closeAddSchoolModal.bind(this);
        this.openEditSchoolModal = this.openEditSchoolModal.bind(this);
        this.closeEditSchoolModal = this.closeEditSchoolModal.bind(this);
        this.addSchool = this.addSchool.bind(this);
        this.editSchool = this.editSchool.bind(this);
        this.deleteSchool = this.deleteSchool.bind(this);
    }

    public componentDidMount(): void {
        this.schoolsService.subscribe((schools) => {
            this.setState({
                isFetching: false,
                schools,
            });
        });
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <AuthenticatedLayout router={{ history: this.props.history }}>
                    <Row>
                        <Col xl={12} span={24}>
                            <SchoolList
                                isLoading={this.state.isFetching}
                                schools={this.state.schools}
                                deleteSchool={this.deleteSchool}
                                onAddSchoolRequest={this.openAddSchoolModal}
                                onEditSchoolRequest={this.openEditSchoolModal}
                            />
                        </Col>
                        <Col xl={12} span={24}>
                            <EducationsTable />
                        </Col>
                    </Row>
                </AuthenticatedLayout>
                <SchoolFormModal
                    title="Nieuwe school toevoegen"
                    okText="Voeg toe"
                    isVisible={this.state.isAddSchoolModalVisible}
                    submitSchool={this.addSchool}
                    onCloseRequest={this.closeAddSchoolModal}
                    schoolToEdit={undefined}
                />
                <SchoolFormModal
                    title="School bewerken"
                    okText="Bewerk"
                    isVisible={this.state.isEditSchoolModalVisible}
                    submitSchool={this.editSchool}
                    onCloseRequest={this.closeEditSchoolModal}
                    schoolToEdit={this.state.schoolToEdit}
                />
            </React.Fragment>
        );
    }

    private openAddSchoolModal(): void {
        this.setState({ isAddSchoolModalVisible: true });
    }

    private closeAddSchoolModal(): void {
        this.setState({ isAddSchoolModalVisible: false });
    }

    private openEditSchoolModal(school: ISchool): void {
        this.setState({
            isEditSchoolModalVisible: true,
            schoolToEdit: school,
        });
    }

    private closeEditSchoolModal(): void {
        this.setState({ isEditSchoolModalVisible: false });
    }

    private addSchool(school: ISchool): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            this.schoolsService.add(school)
                .then(() => {
                    notification.success({
                        message: `School "${school.name}" succesvol toegevoegd`,
                    });
                    resolve();
                })
                .catch(() => {
                    notification.error({
                        message: "Kon school niet toevoegen",
                    });
                    reject();
                });
        });
    }

    private editSchool(school: ISchool): Promise<void> {
        school.id = this.state.schoolToEdit!.id;
        return new Promise<void>((resolve, reject): void => {
            this.schoolsService.update(school)
                .then(() => {
                    notification.success({
                        message: `School "${school.name}" succesvol bewerkt`,
                    });
                    resolve();
                })
                .catch(() => {
                    notification.error({
                        message: "Kon school niet bewerken",
                    });
                    reject();
                });
        });
    }

    private deleteSchool(school: ISchool): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            this.schoolsService.delete(school)
                .then(() => {
                    notification.success({
                        message: `School "${school.name}" succesvol verwijderd`,
                    });
                    resolve();
                })
                .catch(() => {
                    notification.error({
                        message: `Kon school "${school.name}" niet verwijderen, probeer later opnieuw`,
                    });
                    reject();
                });
        });
    }
}
