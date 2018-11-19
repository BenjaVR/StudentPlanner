import React from "react";
import { ISchool } from "../../services/interfaces/ISchool";

interface ISchoolListProps {
    schools: ISchool[];
}

export default class SchoolList extends React.Component<ISchoolListProps> {

    public render() {
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

    private renderSchoolRow(school: ISchool) {
        return (
            <tr key={school.id}>
                <td>{school.name}</td>
            </tr>
        );
    }
}
