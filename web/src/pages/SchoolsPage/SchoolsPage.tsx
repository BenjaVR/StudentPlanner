import { notification } from "antd";
import React from "react";
import { RouteComponentProps } from "react-router";
import { SchoolForm } from "../../components/SchoolForm";
import { SchoolList } from "../../components/SchoolList";
import { SchoolsService } from "../../services/firestore/SchoolsService";
import { ISchool } from "../../services/interfaces/ISchool";

interface ISchoolsPageProps extends RouteComponentProps<any> {
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

    public componentDidMount() {
        this.fetchSchools();
    }

    public render() {
        return (
            <div>
                <SchoolList schools={this.state.schools} />
                <SchoolForm addSchool={this.addSchool} />
            </div>
        );
    }

    private fetchSchools() {
        this.schoolsService.listSchools()
            .then((schools: ISchool[]) => {
                this.setState({ schools });
            })
            .catch((error: Error) => {
                notification.error({
                    message: error.message, // TODO: show this message or choose a different one?
                    placement: "bottomRight", // TODO: global config?
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
                    placement: "bottomRight", // TODO: global config?
                });
            })
            .catch(() => {
                notification.error({
                    message: "School could not be added!",
                    placement: "bottomRight", // TODO: global config?
                });
            });

        return promise;
    }
}
