import { Button, Col, Popconfirm, Row, Spin, Table, Tooltip } from "antd";
import { ColumnFilterItem, ColumnProps } from "antd/lib/table";
import React from "react";
import { IEducation } from "studentplanner-functions/shared/contract/IEducation";
import { ISchool } from "studentplanner-functions/shared/contract/ISchool";
import { IStudent } from "studentplanner-functions/shared/contract/IStudent";
import { emptyFilterOptionValue, exactMatchOrDefaultOptionFilter, hasElementWithId } from "../../helpers/filters";
import { stringSorter } from "../../helpers/sorters";
import styles from "../DataTable.module.scss";

interface IStudentsTableProps {
    isLoading: boolean;
    students: IStudent[];
    schools: ISchool[];
    isLoadingSchools: boolean;
    educations: IEducation[];
    isLoadingEducations: boolean;
    deleteStudent: (student: IStudent) => Promise<void>;
    onAddStudentRequest: () => void;
    onEditStudentRequest: (student: IStudent) => void;
}

class StudentsTable extends React.Component<IStudentsTableProps> {

    constructor(props: IStudentsTableProps) {
        super(props);

        this.renderSchoolName = this.renderSchoolName.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.renderTableTitle = this.renderTableTitle.bind(this);
    }

    public render(): React.ReactNode {
        const columns = this.getTableColumns();

        return (
            <Table
                title={this.renderTableTitle}
                columns={columns}
                rowKey={this.generateTableRowKey}
                dataSource={this.props.students}
                loading={this.props.isLoading}
                size="middle"
                bordered={true}
                scroll={{ x: true }}
                className={styles.table}
            />
        );
    }

    private renderSchoolName(student: IStudent): React.ReactNode {
        if (this.props.isLoadingSchools) {
            return <Spin size="small" spinning={true} />;
        }

        if (student.schoolId === undefined) {
            return "";
        }

        return this.getSchoolNameForStudent(student);
    }

    private renderEducationName(student: IStudent): React.ReactNode {
        if (this.props.isLoadingEducations) {
            return <Spin size="small" spinning={true} />;
        }

        if (student.educationId === undefined) {
            return "";
        }

        return this.getEducationNameForStudent(student);
    }

    private renderActions(student: IStudent): React.ReactNode {
        const deleteFunc = () => this.props.deleteStudent(student);
        const editFunc = () => this.props.onEditStudentRequest(student);
        return (
            <React.Fragment>
                <Tooltip title="Bewerken">
                    <Button
                        size="small"
                        icon="edit"
                        type="primary"
                        ghost={true}
                        onClick={editFunc}
                        className={styles.actionButton}
                    />
                </Tooltip>
                <Tooltip title="Verwijderen">
                    <Popconfirm
                        title="Weet u zeker dat u deze student wilt verwijderen?"
                        onConfirm={deleteFunc}
                    >
                        <Button
                            size="small"
                            icon="delete"
                            type="danger"
                            ghost={true}
                            className={styles.actionButton}
                        />
                    </Popconfirm>
                </Tooltip>
            </React.Fragment>
        );
    }

    private renderTableTitle(): React.ReactNode {
        return (
            <Row type="flex" justify="space-between" align="middle">
                <Col className={styles.col}>
                    <Button icon="plus" type="primary" onClick={this.props.onAddStudentRequest}>
                        Nieuwe student
                    </Button>
                </Col>
            </Row>
        );
    }

    private generateTableRowKey(record: IStudent, index: number): string {
        return record.id || index.toString();
    }

    private getSchoolNameForStudent(student: IStudent): string {
        const school = this.props.schools.find((s) => student.schoolId !== undefined && student.schoolId === s.id);
        if (school === undefined) {
            return "";
        }

        return school.name;
    }

    private getEducationNameForStudent(student: IStudent): string {
        const education = this.props.educations.find((e) => student.educationId !== undefined && student.educationId === e.id);
        if (education === undefined) {
            return "";
        }

        return education.name;
    }

    private getTableColumns(): Array<ColumnProps<IStudent>> {
        return [
            {
                title: "Naam",
                key: "name",
                render: (record: IStudent) => this.getStudentName(record),
                sorter: (a, b) => stringSorter(this.getStudentName(a), this.getStudentName(b)),
            },
            {
                title: "School",
                key: "school",
                render: (record: IStudent) => this.renderSchoolName(record),
                sorter: (a, b) => stringSorter(this.getSchoolNameForStudent(a), this.getSchoolNameForStudent(b)),
                filters: this.getSchoolFilters(),
                onFilter: (value, record: IStudent) => {
                    return exactMatchOrDefaultOptionFilter(value,
                        hasElementWithId(this.props.schools, record.schoolId)
                            ? record.schoolId
                            : undefined);
                },
            },
            {
                title: "Opleiding",
                key: "education",
                render: (record: IStudent) => this.renderEducationName(record),
                sorter: (a, b) => stringSorter(this.getEducationNameForStudent(a), this.getEducationNameForStudent(b)),
                filters: this.getEducationFilters(),
                onFilter: (value, record: IStudent) => {
                    return exactMatchOrDefaultOptionFilter(value,
                        hasElementWithId(this.props.educations, record.educationId)
                            ? record.educationId
                            : undefined);
                },
            },
            {
                title: "Acties",
                key: "actions",
                width: 120,
                align: "center",
                render: (record: IStudent) => this.renderActions(record),
            },
        ];
    }

    private getSchoolFilters(): ColumnFilterItem[] {
        const filters: ColumnFilterItem[] = this.props.schools.map((school) => {
            return {
                text: school.name,
                value: school.id!,
            };
        });
        filters.unshift({
            text: "Zonder school",
            value: emptyFilterOptionValue,
        });
        return filters;
    }

    private getEducationFilters(): ColumnFilterItem[] {
        const filters: ColumnFilterItem[] = this.props.educations.map((education) => {
            return {
                text: education.name,
                value: education.id!,
            };
        });
        filters.unshift({
            text: "Zonder opleiding",
            value: emptyFilterOptionValue,
        });
        return filters;
    }

    private getStudentName(student: IStudent): string {
        if (student.lastName === undefined) {
            return student.firstName;
        }
        return `${student.firstName} ${student.lastName}`;
    }
}

export default StudentsTable;
