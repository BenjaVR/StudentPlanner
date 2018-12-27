import { Spin } from "antd";
import React from "react";
import { ISchool } from "../../models/School";

interface ISchoolListProps {
    schools: ISchool[];
    isLoading: boolean;
}

class SchoolList extends React.Component<ISchoolListProps> {

    public render(): React.ReactNode {
        return (
            <Spin spinning={this.props.isLoading}>
                <table>
                    <thead>
                        <tr>
                            <th>Scholen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.schools.map(this.renderSchoolRow)}
                    </tbody>
                </table>
            </Spin>
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
