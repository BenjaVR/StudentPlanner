import { Col, notification, Row } from "antd";
import React from "react";
import { ISchool } from "../../models/School";
import { RoutePageComponentProps } from "../../routes";
import { SchoolsService } from "../../services/SchoolsService";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import SchoolFormModal from "./SchoolFormModal";
import SchoolList from "./SchoolList";

type SchoolsPageProps = RoutePageComponentProps;

interface ISchoolsPageState {
    schools: ISchool[];
    isFetching: boolean;
    isAddSchoolModalVisible: boolean;
}

export default class SchoolsPage extends React.Component<SchoolsPageProps, ISchoolsPageState> {

    private readonly schoolsService = new SchoolsService();

    constructor(props: SchoolsPageProps) {
        super(props);

        this.state = {
            schools: [],
            isFetching: false,
            isAddSchoolModalVisible: false,
        };

        this.openAddSchoolModal = this.openAddSchoolModal.bind(this);
        this.closeAddSchoolModal = this.closeAddSchoolModal.bind(this);
        this.addSchool = this.addSchool.bind(this);
        this.deleteSchool = this.deleteSchool.bind(this);
    }

    public componentDidMount(): void {
        this.fetchSchools();
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
                            />
                        </Col>
                    </Row>
                </AuthenticatedLayout>
                <SchoolFormModal
                    title="Nieuwe school toevoegen"
                    okText="Voeg toe"
                    isVisible={this.state.isAddSchoolModalVisible}
                    submitSchool={this.addSchool}
                    onCloseRequest={this.closeAddSchoolModal}
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

    private addSchool(school: ISchool): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.schoolsService.addSchool(school)
                .then(() => {
                    notification.success({
                        message: `School "${school.name}" succesvol toegevoegd`,
                    });
                    this.fetchSchools();
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

    private deleteSchool(school: ISchool): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.schoolsService.deleteSchool(school)
                .then(() => {
                    notification.success({
                        message: `School "${school.name}" succesvol verwijderd`,
                    });
                    this.fetchSchools();
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

    private fetchSchools(): void {
        this.setState({
            isFetching: true,
        });

        this.schoolsService.listSchools()
            .then((schools) => {
                this.setState({
                    schools,
                });
            })
            .finally(() => {
                this.setState({
                    isFetching: false,
                });
            });
    }
}
