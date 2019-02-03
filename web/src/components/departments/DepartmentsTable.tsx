import { Button, Col, Popconfirm, Row, Table, Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import React from "react";
import { stringSorter } from "../../helpers/sorters";
import { Department } from "../../models/Department";
import styles from "../DataTable.module.scss";

interface IDepartmentsTableProps {
    isLoading: boolean;
    departments: Department[];
    deleteDepartment: (department: Department) => Promise<void>;
    onAddDepartmentRequest: () => void;
    onEditDepartmentRequest: (department: Department) => void;
}

class DepartmentsTable extends React.Component<IDepartmentsTableProps> {

    private columns: Array<ColumnProps<Department>> = [
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
            render: (record: Department) => this.renderActions(record),
        },
    ];

    constructor(props: IDepartmentsTableProps) {
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
                dataSource={this.props.departments}
                loading={this.props.isLoading}
                size="middle"
                bordered={true}
                scroll={{ x: true }}
                className={styles.table}
            />
        );
    }

    private renderActions(department: Department): React.ReactNode {
        const deleteFunc = () => this.props.deleteDepartment(department);
        const editFunc = () => this.props.onEditDepartmentRequest(department);
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
                        title="Weet u zeker dat u deze opleiding wilt verwijderen?"
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
                    <Button icon="plus" type="primary" onClick={this.props.onAddDepartmentRequest}>
                        Nieuwe opleiding
                    </Button>
                </Col>
            </Row>
        );
    }

    private generateTableRowKey(record: Department, index: number): string {
        return record.id || index.toString();
    }
}

export default DepartmentsTable;
