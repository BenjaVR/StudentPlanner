import { Button, Col, Popconfirm, Row, Table, Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import React from "react";
import { stringSorter } from "../../helpers/sorters";
import { Department } from "../../models/Department";
import { Education } from "../../models/Education";
import { School } from "../../models/School";
import styles from "../DataTable.module.scss";
import SchoolInternshipSummaryModal from "./SchoolInternshipSummaryModal";

interface ISchoolsTableProps {
    isLoading: boolean;
    schools: School[];
    departments: Department[];
    educations: Education[];
    deleteSchool: (school: School) => Promise<void>;
    onAddSchoolRequest: () => void;
    onEditSchoolRequest: (school: School) => void;
}

interface ISchoolsTableState {
    isInternshipSummaryModalOpen: boolean;
    selectedSchool: School | undefined;
}

class SchoolsTable extends React.Component<ISchoolsTableProps, ISchoolsTableState> {
    private columns: Array<ColumnProps<School>> = [
        {
            title: "Naam",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => stringSorter(a.name, b.name),
        },
        {
            title: "Stages",
            width: 120,
            render: (record: School) => this.renderInternshipsAction(record),
        },
        {
            title: "Acties",
            key: "actions",
            width: 120,
            align: "center",
            render: (record: School) => this.renderActions(record),
        },
    ];

    constructor(props: ISchoolsTableProps) {
        super(props);

        this.state = {
            isInternshipSummaryModalOpen: false,
            selectedSchool: undefined,
        };

        this.renderInternshipsAction = this.renderInternshipsAction.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.renderTableTitle = this.renderTableTitle.bind(this);
        this.handleOpenInternshipSummary = this.handleOpenInternshipSummary.bind(this);
        this.handleCloseInternshipSummary = this.handleCloseInternshipSummary.bind(this);
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <Table
                    title={this.renderTableTitle}
                    columns={this.columns}
                    rowKey={this.generateTableRowKey}
                    dataSource={this.props.schools}
                    loading={this.props.isLoading}
                    size="middle"
                    bordered={true}
                    scroll={{ x: true }}
                    className={styles.table}
                />
                <SchoolInternshipSummaryModal
                    isVisible={this.state.isInternshipSummaryModalOpen}
                    selectedSchool={this.state.selectedSchool}
                    departments={this.props.departments}
                    educations={this.props.educations}
                    handleClose={this.handleCloseInternshipSummary}
                />
            </React.Fragment>
        );
    }

    private renderInternshipsAction(school: School): React.ReactNode {
        const handleOpenInternshipSummaryFn = () => this.handleOpenInternshipSummary(school);
        return <a onClick={handleOpenInternshipSummaryFn}>Bekijk stages</a>;
    }

    private renderActions(school: School): React.ReactNode {
        const deleteFunc = () => this.props.deleteSchool(school);
        const editFunc = () => this.props.onEditSchoolRequest(school);
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
                    <Popconfirm title="Weet u zeker dat u deze school wilt verwijderen?" onConfirm={deleteFunc}>
                        <Button size="small" icon="delete" type="danger" ghost={true} className={styles.actionButton} />
                    </Popconfirm>
                </Tooltip>
            </React.Fragment>
        );
    }

    private renderTableTitle(): React.ReactNode {
        return (
            <Row type="flex" justify="space-between" align="middle">
                <Col>
                    <Button icon="plus" type="primary" onClick={this.props.onAddSchoolRequest}>
                        Nieuwe school
                    </Button>
                </Col>
            </Row>
        );
    }

    private handleOpenInternshipSummary(school: School): void {
        this.setState({
            isInternshipSummaryModalOpen: true,
            selectedSchool: school,
        });
    }

    private handleCloseInternshipSummary(): void {
        this.setState({
            isInternshipSummaryModalOpen: false,
            selectedSchool: undefined,
        });
    }

    private generateTableRowKey(record: School, index: number): string {
        return record.id || index.toString();
    }
}

export default SchoolsTable;
