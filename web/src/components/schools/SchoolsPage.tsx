import { notification } from "antd";
import React from "react";
import { ISchool } from "../../models/School";
import { RoutePageComponentProps } from "../../routes";
import { SchoolsService } from "../../services/SchoolsService";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import SchoolForm from "./SchoolForm";
import SchoolList from "./SchoolList";

type SchoolsPageProps = RoutePageComponentProps;

interface ISchoolsPageState {
    schools: ISchool[];
    isFetching: boolean;
}

export default class SchoolsPage extends React.Component<SchoolsPageProps, ISchoolsPageState> {

    private readonly schoolsService = new SchoolsService();

    constructor(props: SchoolsPageProps) {
        super(props);

        this.state = {
            schools: [],
            isFetching: false,
        };

        this.addSchool = this.addSchool.bind(this);
    }

    public componentDidMount(): void {
        this.fetchSchools();
    }

    public render(): React.ReactNode {
        return (
            <AuthenticatedLayout>
                <SchoolList schools={this.state.schools} isLoading={this.state.isFetching} />
                <SchoolForm submitSchool={this.addSchool} />
            </AuthenticatedLayout>
        );
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
