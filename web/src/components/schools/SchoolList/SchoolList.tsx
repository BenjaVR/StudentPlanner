import { Spin } from "antd";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ISchool } from "shared/dist/models/School";
import { IApplicationState } from "../../../stores";
import { fetchSchools } from "../../../stores/schools/actions";
import { ISchoolsState } from "../../../stores/schools/reducer";

interface ISchoolListProps {
}

type SchoolListProps = ISchoolListProps & IStateProps & IDispatchProps;

class SchoolList extends React.Component<SchoolListProps> {

    public componentDidMount(): void {
        this.props.fetchSchools();
    }

    public render(): React.ReactNode {
        return (
            <Spin spinning={this.props.schoolsStore.loadingStatus === "LOADING"}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>School</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.schoolsStore.schools.map(this.renderSchoolRow)}
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

interface IStateProps {
    schoolsStore: ISchoolsState;
}

function mapStateToProps(state: IApplicationState): IStateProps {
    return {
        schoolsStore: state.schools,
    };
}

interface IDispatchProps {
    fetchSchools: () => void;
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return {
        fetchSchools: bindActionCreators(fetchSchools, dispatch),
    };
}

const ConnectedSchoolList = connect<IStateProps, IDispatchProps, ISchoolListProps, IApplicationState>(
    mapStateToProps, mapDispatchToProps)(SchoolList);

export default ConnectedSchoolList;
