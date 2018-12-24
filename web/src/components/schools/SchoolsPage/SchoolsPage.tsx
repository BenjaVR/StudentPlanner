import { notification } from "antd";
import React from "react";
import { ISchool } from "../../../models/School";
import { RoutePageComponentProps } from "../../../routes";
import { SchoolsService } from "../../../services/SchoolsService";
import { SignedInLayout } from "../../layouts/SignedInLayout";
import { SchoolForm } from "../SchoolForm";
import { SchoolList } from "../SchoolList";

interface ISchoolsPageProps extends RoutePageComponentProps {
}

interface ISchoolsPageState {
    schools: ISchool[];
    isFetching: boolean;
}

export default class SchoolsPage extends React.Component<ISchoolsPageProps, ISchoolsPageState> {

    private readonly schoolsService = new SchoolsService();

    constructor(props: ISchoolsPageProps) {
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
            <SignedInLayout>
                <SchoolList schools={this.state.schools} isLoading={this.state.isFetching} />
                <SchoolForm submitSchool={this.addSchool} />
            </SignedInLayout>
        );
    }

    private addSchool(school: ISchool): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.schoolsService.addSchool(school)
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
