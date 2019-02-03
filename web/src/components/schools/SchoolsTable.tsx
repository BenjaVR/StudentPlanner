import { Button, Col, Popconfirm, Row, Table, Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import React from "react";
import { stringSorter } from "../../helpers/sorters";
import { School } from "../../models/School";
import styles from "../DataTable.module.scss";

interface ISchoolsTableProps {
    isLoading: boolean;
    schools: School[];
    deleteSchool: (school: School) => Promise<void>;
    onAddSchoolRequest: () => void;
    onEditSchoolRequest: (school: School) => void;
}

class SchoolsTable extends React.Component<ISchoolsTableProps> {

    private columns: Array<ColumnProps<School>> = [
        {
            title: "Naam",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => stringSorter(a.name, b.name),
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

        this.renderActions = this.renderActions.bind(this);
        this.renderTableTitle = this.renderTableTitle.bind(this);
    }

    public render(): React.ReactNode {
        return (
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
        );
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
                    <Popconfirm
                        title="Weet u zeker dat u deze school wilt verwijderen?"
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
                    <Button icon="plus" type="primary" onClick={this.props.onAddSchoolRequest}>
                        Nieuwe school
                    </Button>
                </Col>
            </Row>
        );
    }

    private generateTableRowKey(record: School, index: number): string {
        return record.id || index.toString();
    }
}

export default SchoolsTable;
