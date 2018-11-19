import Promise from "bluebird";
import React from "react";
import { RouteComponentProps } from "react-router";
import { SchoolForm } from "../../components/SchoolForm";
import { SchoolList } from "../../components/SchoolList";
import { SchoolsService } from "../../services/firebase/firestore/SchoolsService";
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
                <SchoolList schools={this.state.schools}/>
                <SchoolForm addSchool={this.addSchool}/>
            </div>
        );
    }

    private fetchSchools() {
        this.schoolsService.listSchools()
            .then((schools: ISchool[]) => {
                this.setState({schools});
            })
            .catch((error) => {
                // tslint:disable-next-line: no-console TODO: handle (log) this error, show error notification?
                console.log("Failed fetching schools:", error);
            });
    }

    private addSchool(school: ISchool): Promise<void> {
        const promise = new Promise<void>((resolve, reject) => {
            this.schoolsService.addSchool(school)
                .then(() => {
                    // TODO: show success notification?
                    return resolve();
                })
                .catch((error) => {
                    // tslint:disable-next-line: no-console TODO: handle (log) this error, show error notification?
                    console.log("Failed adding school:", error);
                    return reject(error);
                });
        });

        promise.then(() => {
            this.fetchSchools();
        });

        return promise;
    }
}
