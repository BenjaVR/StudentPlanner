import React from "react";
import { ISchool } from "shared/dist/models/School";

interface ISchoolListProps {
    schools: ISchool[];
}

class SchoolList extends React.Component<ISchoolListProps> {

    public render(): React.ReactNode {
        return (
            <table className="table">
                <thead>
                <tr>
                    <th>School</th>
                </tr>
                </thead>
                <tbody>
                {this.props.schools.map(this.renderSchoolRow)}
                </tbody>
            </table>
        );
    }

    private renderSchoolRow(school: ISchool): React.ReactNode {
        return (
            <tr key={school.id}>
                <td>{school.name}</td>
            </tr>
        );
    }
}

export default SchoolList;
