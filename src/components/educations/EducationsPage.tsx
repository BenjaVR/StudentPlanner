import { Col, notification, Row } from "antd";
import React from "react";
import { Education } from "../../models/Education";
import { AnyRouteComponentProps } from "../../routes";
import { EducationsRepository } from "../../services/repositories/EducationsRepository";
import EducationsTable from "../educations/EducationsTable";
import EducationFormModal from "./EducationsFormModal";

type EducationsPageProps = AnyRouteComponentProps;

interface IEducationsPageState {
    educations: Education[];
    isFetching: boolean;
    isAddEducationModalVisible: boolean;
    isEditEducationModalVisible: boolean;
    educationToEdit: Education | undefined;
}

export default class EducationsPage extends React.Component<EducationsPageProps, IEducationsPageState> {
    private unsubscribeFromEducations: () => void;

    constructor(props: EducationsPageProps) {
        super(props);

        this.state = {
            educations: [],
            isFetching: true,
            isAddEducationModalVisible: false,
            isEditEducationModalVisible: false,
            educationToEdit: undefined,
        };

        this.unsubscribeFromEducations = () => {
            return;
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
        this.unsubscribeFromEducations = EducationsRepository.subscribeToEducations((educations) => {
            this.setState({
                isFetching: false,
                educations,
            });
        });
    }

    public componentWillUnmount(): void {
        this.unsubscribeFromEducations();
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
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

    private openEditEducationModal(education: Education): void {
        this.setState({
            isEditEducationModalVisible: true,
            educationToEdit: education,
        });
    }

    private closeEditEducationModal(): void {
        this.setState({ isEditEducationModalVisible: false });
    }

    private addEducation(education: Education): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            EducationsRepository.addEducation(education)
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

    private editEducation(education: Education): Promise<void> {
        education.id = this.state.educationToEdit!.id;
        return new Promise<void>((resolve, reject): void => {
            EducationsRepository.updateEducation(education)
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

    private deleteEducation(education: Education): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            EducationsRepository.deleteEducation(education)
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
