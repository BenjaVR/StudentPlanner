import { ISchool } from "@studentplanner/functions/dist/shared/models/School";
import React from "react";
import { RoutePageComponentProps } from "../../../routes";
import { SignedInLayout } from "../../layouts/SignedInLayout";
import { SchoolForm } from "../SchoolForm";
import { SchoolList } from "../SchoolList";

interface ISchoolsPageProps extends RoutePageComponentProps {
}

interface ISchoolsPageState {
    schools: ISchool[];
}

export default class SchoolsPage extends React.Component<ISchoolsPageProps, ISchoolsPageState> {

    constructor(props: ISchoolsPageProps) {
        super(props);

        this.state = {
            schools: [],
        };
    }

    public render(): React.ReactNode {
        return (
            <SignedInLayout>
                <SchoolList />
                <SchoolForm />
            </SignedInLayout>
        );
    }
}
