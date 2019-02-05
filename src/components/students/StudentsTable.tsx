import { Button, Col, Popconfirm, Row, Spin, Table, Tooltip } from "antd";
import { ColumnFilterItem, ColumnProps } from "antd/lib/table";
import React from "react";
import { emptyFilterOptionValue, exactMatchOrDefaultOptionFilter, hasElementWithId } from "../../helpers/filters";
import { stringSorter } from "../../helpers/sorters";
import { Education } from "../../models/Education";
import { School } from "../../models/School";
import { Student } from "../../models/Student";
import styles from "../DataTable.module.scss";

interface IStudentsTableProps {
    isLoading: boolean;
    students: Student[];
    schools: School[];
    isLoadingSchools: boolean;
    educations: Education[];
    isLoadingEducations: boolean;
    deleteStudent: (student: Student) => Promise<void>;
    onAddStudentRequest: () => void;
    onEditStudentRequest: (student: Student) => void;
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

    private renderSchoolName(student: Student): React.ReactNode {
        if (this.props.isLoadingSchools) {
            return <Spin size="small" spinning={true} />;
        }

        if (student.schoolId === undefined) {
            return "";
        }

        return this.getSchoolNameForStudent(student);
    }

    private renderEducationName(student: Student): React.ReactNode {
        if (this.props.isLoadingEducations) {
            return <Spin size="small" spinning={true} />;
        }

        if (student.educationId === undefined) {
            return "";
        }

        return this.getEducationNameForStudent(student);
    }

    private renderActions(student: Student): React.ReactNode {
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
                <Col>
                    <Button icon="plus" type="primary" onClick={this.props.onAddStudentRequest}>
                        Nieuwe student
                    </Button>
                </Col>
            </Row>
        );
    }

    private generateTableRowKey(record: Student, index: number): string {
        return record.id || index.toString();
    }

    private getSchoolNameForStudent(student: Student): string {
        const school = this.props.schools.find((s) => student.schoolId !== undefined && student.schoolId === s.id);
        if (school === undefined) {
            return "";
        }

        return school.name;
    }

    private getEducationNameForStudent(student: Student): string {
        const education = this.props.educations.find((e) => student.educationId !== undefined && student.educationId === e.id);
        if (education === undefined) {
            return "";
        }

        return education.name;
    }

    private getTableColumns(): Array<ColumnProps<Student>> {
        return [
            {
                title: "Naam",
                key: "name",
                render: (record: Student) => record.fullName,
                sorter: (a, b) => stringSorter(a.fullName, b.fullName),
            },
            {
                title: "School",
                key: "school",
                render: (record: Student) => this.renderSchoolName(record),
                sorter: (a, b) => stringSorter(this.getSchoolNameForStudent(a), this.getSchoolNameForStudent(b)),
                filters: this.getSchoolFilters(),
                onFilter: (value, record: Student) => {
                    return exactMatchOrDefaultOptionFilter(value,
                        hasElementWithId(this.props.schools, record.schoolId)
                            ? record.schoolId
                            : undefined);
                },
            },
            {
                title: "Opleiding",
                key: "education",
                render: (record: Student) => this.renderEducationName(record),
                sorter: (a, b) => stringSorter(this.getEducationNameForStudent(a), this.getEducationNameForStudent(b)),
                filters: this.getEducationFilters(),
                onFilter: (value, record: Student) => {
                    return exactMatchOrDefaultOptionFilter(value,
                        hasElementWithId(this.props.educations, record.educationId)
                            ? record.educationId
                            : undefined);
                },
            },
            {
                title: "Bevestigd",
                key: "isConfirmed",
                render: (record: Student) => record.isConfirmed ? "Ja" : "",
                filters: [{ text: "Bevestigd", value: "1" }, { text: "Niet bevestigd", value: "0" }],
                onFilter: (value, record: Student) => exactMatchOrDefaultOptionFilter(value, record.isConfirmed ? "1" : "0"),
            },
            {
                title: "Ingepland",
                key: "isPlanned",
                render: (record: Student) => record.isPlanned ? "Ja" : "",
                filters: [{ text: "Ingepland", value: "1" }, { text: "Niet ingepland", value: "0" }],
                onFilter: (value, record: Student) => exactMatchOrDefaultOptionFilter(value, record.isPlanned ? "1" : "0"),
            },
            {
                title: "Acties",
                key: "actions",
                width: 120,
                align: "center",
                render: (record: Student) => this.renderActions(record),
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
}

export default StudentsTable;