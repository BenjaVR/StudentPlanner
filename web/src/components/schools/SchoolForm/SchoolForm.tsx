import { ISchool } from "@studentplanner/functions/dist/shared/models/School";
import React from "react";
import { ISchoolsState } from "../../../stores/schools/reducer";
import { IApplicationState } from "../../../stores";
import { Dispatch, bindActionCreators } from "redux";
import { fetchSchools, addSchool } from "../../../stores/schools/actions";
import { connect } from "react-redux";
import { notification } from "antd";

interface ISchoolFormProps {
}

type SchoolFormProps = ISchoolFormProps & IStateProps & IDispatchProps;

interface ISchoolFormState {
    school: ISchool;
}

class SchoolForm extends React.Component<SchoolFormProps, ISchoolFormState> {

    private readonly emptySchool: ISchool = {
        name: "",
    };

    constructor(props: SchoolFormProps) {
        super(props);

        this.state = {
            school: this.emptySchool,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    public componentDidUpdate(prevProps: SchoolFormProps): void {
        if (prevProps.schoolsStore.addingStatus === "ADDING" && this.props.schoolsStore.addingStatus === "ADDED") {
            const schoolName = this.props.schoolsStore.lastAddedSchool !== undefined
                ? this.props.schoolsStore.lastAddedSchool.name : "";
            notification.success({
                message: `Successfully added school "${schoolName}"!`, // TODO: translate
            });
            this.resetForm();
        }

        if (prevProps.schoolsStore.addingStatus === "ADDING" && this.props.schoolsStore.addingStatus === "FAILED") {
            notification.error({
                message: this.props.schoolsStore.addErrorMessage, // TODO: translate (key)
            });
        }
    }

    public render(): React.ReactNode {
        const isLoading = this.props.schoolsStore.addingStatus === "ADDING";

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="field">
                    <label className="label">School naam</label> {/*//TODO: translate */}
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            placeholder="Mijn School"
                            name="name"
                            onChange={this.handleChange}
                            value={this.state.school.name}
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <button
                            type="submit"
                            className={`button is-primary ${isLoading ? "is-loading" : ""}`}
                        >
                            Voeg school toe {/*//TODO: translate */}
                        </button>
                    </div>
                </div>
            </form>
        );
    }

    private handleSubmit(event: React.FormEvent): void {
        event.preventDefault();

        this.props.actions.addSchool(this.state.school);
    }

    private handleChange(event: React.FormEvent<HTMLInputElement>): void {
        const target = event.currentTarget;

        // TODO: check if one of the fields is a field of School, and then add it dynamically (instead of switch)
        switch (target.name) {
            case "name":
                this.setState({
                    school: {
                        ...this.state.school,
                        name: target.value,
                    },
                });
                break;
        }
    }

    private resetForm(): void {
        this.setState({school: this.emptySchool});
    }
}

interface IStateProps {
    schoolsStore: ISchoolsState;
}

function mapStateToProps(state: IApplicationState): IStateProps {
    return {
        schoolsStore: state.schools,
    }
}

interface IDispatchProps {
    actions: {
        fetchSchools: () => void;
        addSchool: (school: ISchool) => void;
    }
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return {
        actions: bindActionCreators({
            fetchSchools,
            addSchool,
        }, dispatch),
    }
}

const ConnectedSchoolForm = connect<IStateProps, IDispatchProps, ISchoolFormProps, IApplicationState>(
    mapStateToProps, mapDispatchToProps)(SchoolForm);

export default ConnectedSchoolForm;
