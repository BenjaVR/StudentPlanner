import { Col, notification, Row } from "antd";
import React from "react";
import { IEducation } from "studentplanner-functions/src/contract/IEducation";
import { RoutePageComponentProps, routes } from "../../routes";
import { EducationsService } from "../../services/EducationsService";
import EducationsTable from "../educations/EducationsTable";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import EducationFormModal from "./EducationsFormModal";

type EducationsPageProps = RoutePageComponentProps;

interface IEducationsPageState {
    educations: IEducation[];
    isFetching: boolean;
    isAddEducationModalVisible: boolean;
    isEditEducationModalVisible: boolean;
    educationToEdit: IEducation | undefined;
}

export default class EducationsPage extends React.Component<EducationsPageProps, IEducationsPageState> {

    private readonly educationsService = new EducationsService();

    constructor(props: EducationsPageProps) {
        super(props);

        this.state = {
            educations: [],
            isFetching: true,
            isAddEducationModalVisible: false,
            isEditEducationModalVisible: false,
            educationToEdit: undefined,
        };

        this.openAddEducationModal = this.openAddEducationModal.bind(this);
        this.closeAddEducationModal = this.closeAddEducationModal.bind(this);
        this.openEditEducationModal = this.openEditEducationModal.bind(this);
        this.closeEditEducationModal = this.closeEditEducationModal.bind(this);
        this.addEducation = this.addEducation.bind(this);
        this.editEducation = this.editEducation.bind(this);
        this.deleteEducation = this.deleteEducation.bind(this);
    }

    public componentDidMount(): void {
        this.educationsService.subscribe((educations) => {
            this.setState({
                isFetching: false,
                educations,
            });
        });
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <AuthenticatedLayout router={{ history: this.props.history }} initialRoute={routes.educationsRoute}>
                    <Row>
                        <Col>
                            <EducationsTable
                                isLoading={this.state.isFetching}
                                educations={this.state.educations}
                                deleteEducation={this.deleteEducation}
                                onAddEducationRequest={this.openAddEducationModal}
                                onEditEducationRequest={this.openEditEducationModal}
                            />
                        </Col>
                    </Row>
                </AuthenticatedLayout>
                <EducationFormModal
                    title="Nieuwe opleiding toevoegen"
                    okText="Voeg toe"
                    isVisible={this.state.isAddEducationModalVisible}
                    submitEducation={this.addEducation}
                    onCloseRequest={this.closeAddEducationModal}
                    educationToEdit={undefined}
                />
                <EducationFormModal
                    title="Opleiding bewerken"
                    okText="Bewerk"
                    isVisible={this.state.isEditEducationModalVisible}
                    submitEducation={this.editEducation}
                    onCloseRequest={this.closeEditEducationModal}
                    educationToEdit={this.state.educationToEdit}
                />
            </React.Fragment>
        );
    }

    private openAddEducationModal(): void {
        this.setState({ isAddEducationModalVisible: true });
    }

    private closeAddEducationModal(): void {
        this.setState({ isAddEducationModalVisible: false });
    }

    private openEditEducationModal(education: IEducation): void {
        this.setState({
            isEditEducationModalVisible: true,
            educationToEdit: education,
        });
    }

    private closeEditEducationModal(): void {
        this.setState({ isEditEducationModalVisible: false });
    }

    private addEducation(education: IEducation): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            this.educationsService.add(education)
                .then(() => {
                    notification.success({
                        message: `Opleiding "${education.name}" succesvol toegevoegd`,
                    });
                    resolve();
                })
                .catch((error) => {
                    notification.error({
                        message: "Kon opleiding niet toevoegen",
                    });
                    reject(error);
                });
        });
    }

    private editEducation(education: IEducation): Promise<void> {
        education.id = this.state.educationToEdit!.id;
        return new Promise<void>((resolve, reject): void => {
            this.educationsService.update(education)
                .then(() => {
                    notification.success({
                        message: `Opleiding "${education.name}" succesvol bewerkt`,
                    });
                    resolve();
                })
                .catch((error) => {
                    notification.error({
                        message: "Kon opleiding niet bewerken",
                    });
                    reject(error);
                });
        });
    }

    private deleteEducation(education: IEducation): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            this.educationsService.delete(education)
                .then(() => {
                    notification.success({
                        message: `Opleiding "${education.name}" succesvol verwijderd`,
                    });
                    resolve();
                })
                .catch((error) => {
                    notification.error({
                        message: `Kon opleiding "${education.name}" niet verwijderen, probeer later opnieuw`,
                    });
                    reject(error);
                });
        });
    }
}
