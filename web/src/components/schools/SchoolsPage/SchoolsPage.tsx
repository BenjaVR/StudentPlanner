import { ISchool } from "@studentplanner/functions/dist/shared/models/School";
import { notification } from "antd";
import React from "react";
import { RoutePageComponentProps } from "../../../routes";
import { SchoolsService } from "../../../services/SchoolsService";
import { SignedInLayout } from "../../layouts/SignedInLayout";
import { SchoolForm } from "../SchoolForm";
import { SchoolList } from "../SchoolList";

interface ISchoolsPageProps extends RoutePageComponentProps {
}

interface ISchoolsPageState {
    schools: ISchool[];
}

export default class SchoolsPage extends React.Component<ISchoolsPageProps, ISchoolsPageState> {

    private readonly schoolsService = new SchoolsService();

    constructor(props: ISchoolsPageProps) {
        super(props);

        this.state = {
            schools: [],
        };

        this.addSchool = this.addSchool.bind(this);
    }

    public componentDidMount(): void {
        this.fetchSchools();
    }

    public render(): React.ReactNode {
        return (
            <SignedInLayout>
                <SchoolList />
                <SchoolForm addSchool={this.addSchool} />
            </SignedInLayout>
        );
    }

    private fetchSchools(): void {
        this.schoolsService.listSchools()
            .then((schools: ISchool[]) => {
                this.setState({ schools });
            })
            .catch((error: Error) => {
                notification.error({
                    message: error.message, // TODO: show this message or choose a different one?
                });
            });
    }

    private addSchool(school: ISchool): Promise<void> {
        const promise = new Promise<void>((resolve, reject) => {
            this.schoolsService.addSchool(school)
                .then(() => {
                    return resolve();
                })
                .catch((error) => {
                    return reject(error);
                });
        });

        promise
            .then(() => {
                this.fetchSchools();
                notification.success({
                    message: "School successfully added!",
                });
            })
            .catch(() => {
                notification.error({
                    message: "School could not be added!",
                });
            });

        return promise;
    }
}
