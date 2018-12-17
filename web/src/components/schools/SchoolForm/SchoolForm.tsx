import React from "react";
import { ISchool } from "shared/dist/models/School";

interface ISchoolFormProps {
    addSchool: (school: ISchool) => Promise<void>;
}

interface ISchoolFormState {
    isLoading: boolean;
    school: ISchool;
}

class SchoolForm extends React.Component<ISchoolFormProps, ISchoolFormState> {

    private readonly emptySchool: ISchool = {
        name: "",
    };

    constructor(props: ISchoolFormProps) {
        super(props);

        this.state = {
            isLoading: false,
            school: this.emptySchool,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    public render(): React.ReactNode {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="field">
                    <label className="label">School naam</label>
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            placeholder="Mijn School"
                            name="name"
                            onChange={this.handleChange}
                            value={this.state.school.name}
                            disabled={this.state.isLoading}
                        />
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <button
                            type="submit"
                            className={`button is-primary ${this.state.isLoading ? "is-loading" : ""}`}
                        >
                            Voeg school toe
                        </button>
                    </div>
                </div>
            </form>
        );
    }

    private handleSubmit(event: React.FormEvent): void {
        event.preventDefault();

        this.setState({isLoading: true});

        // TODO: validate here? or rely on firebase validation rules?
        this.props.addSchool(this.state.school)
            .then(() => {
                this.resetForm();
            })
            .catch((error) => {
                // TODO: add form validation styles (red input field, ...?)
                console.log(error);
                return;
            })
            .finally(() => {
                this.setState({isLoading: false});
            });
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

export default SchoolForm;
